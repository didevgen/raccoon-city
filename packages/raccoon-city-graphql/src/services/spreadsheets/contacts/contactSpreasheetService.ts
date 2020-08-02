import Papa from 'papaparse';
import {Contact} from '../../../db/models/contact';
import {ClientSources, ClientStatuses} from '../../../constants/tradeConstants';

function mapToPapa(contats: Contact[]): any[] {
    return contats.map((contact) => {
        return {
            ID: contact.id,
            Имя: contact.name,
            Почта: contact.email,
            Телефоны: contact.phone?.join(' ') || '',
            Должность: contact.position,
            Ответственный: contact.responsible?.name || '',
            Статус: ClientStatuses.find((status) => status.key === contact.clientStatus)?.displayName || '',
            Источник: ClientSources.find((source) => source.key === contact.clientSources)?.displayName || ''
        };
    });
}
export function contactsToCsv(contacts: Contact[]) {
    return Papa.unparse(mapToPapa(contacts), {
        header: true
    });
}
