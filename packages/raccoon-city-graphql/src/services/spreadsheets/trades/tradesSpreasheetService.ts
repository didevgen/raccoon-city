import Papa from 'papaparse';
import {format, parseISO} from 'date-fns';
import {
    ClientInterests,
    LeadStatuses,
    PaymentProviders,
    PaymentTypes,
    PropertyTypes,
    TradeSources,
    TradeStates
} from '../../../constants/tradeConstants';
import {Trade} from '../../../db/models/trade';

function mapToPapa(trades: Trade[]): any[] {
    return trades.map((trade) => {
        return {
            ID: trade.id,
            'Номер сделки': trade.tradeNumber,
            'Статус сделки': TradeStates.find((state) => state.key === trade.state).displayName,
            Ответственный: trade.responsible.name,
            'Источник заявки': TradeSources.find((item) => trade.tradeSource === item.key)?.displayName || '',
            'Статус лида': LeadStatuses.find((item) => trade.leadStatus === item.key)?.displayName || '',
            'Что интересует': trade.clientInterests
                .map((interest) => {
                    return ClientInterests.find((item) => item.key === interest).displayName;
                })
                .join(' '),
            'Дата визита': trade.visitDate ? format(parseISO(trade.visitDate), 'dd.MM.yyyy') : '',
            'Дата следующего визита': trade.nextVisitDate ? format(parseISO(trade.nextVisitDate), 'dd.MM.yyyy') : '',
            'Тип объекта': PropertyTypes.find((item) => trade.propertyType === item.key)?.displayName || '',
            'Стоимость сделки': trade.flat.price,
            'Скидка %': trade.flat.sale || '',
            'Жилищный комплекс': trade.flat.apartmentComplex || '',
            Дом: trade.flat.house || '',
            Секция: trade.flat.section || '',
            Этаж: trade.flat.level || '',
            'Номер квартиры': trade.flat.flatNumber || '',
            'Тип оплаты': PaymentTypes.find((item) => trade.paymentType === item.key)?.displayName || '',
            'Через кого оплата': PaymentProviders.find((item) => trade.paymentProvider === item.key)?.displayName || ''
        };
    });
}
export function tradesToCsv(trades: Trade[]) {
    return Papa.unparse(mapToPapa(trades), {
        header: true
    });
}
