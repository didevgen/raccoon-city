import React from 'react';
import {
    FloorLegendItem,
    StatusesTooltip,
    FlatStatusesBarContainer,
    StatusesIcon,
    FloorLegendIcon
} from './ChessFloorView/ChessFloorView.styled';
import {useQuery} from '@apollo/react-hooks';
import {COUNT_PUBLIC_FLAT_STATUSES} from '../../../graphql/queries/houseQuery';

export const FlatStatusesBar = ({houseId}) => {
    const {data, error, loading} = useQuery(COUNT_PUBLIC_FLAT_STATUSES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: houseId[0]
        },
        skip: houseId.length === 0
    });

    if (loading) {
        return <div>Loading</div>;
    }

    const {
        countPublicFlats: {FREE, RESERVED, SOLD_OUT, UNAVAILABLE, DOCUMENTS_IN_PROGRESS, BOOKED}
    } = data;

    const flatAmount = FREE + RESERVED + SOLD_OUT + UNAVAILABLE + DOCUMENTS_IN_PROGRESS + BOOKED;

    return (
        <FlatStatusesBarContainer>
            <StatusesIcon>
                <span>?</span>
            </StatusesIcon>

            <StatusesTooltip>
                <p>{`Найдено ${flatAmount} помещений из них свободно ${FREE}`}</p>

                <FloorLegendItem>
                    <FloorLegendIcon color="#4caf50" />
                    <span>{`Свободно ${FREE}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#ffeb3b" />
                    <span>{`Резерв\\Забронировано ${RESERVED + BOOKED}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#f44336" />
                    <span>{`Продано ${SOLD_OUT}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#00bcd4" />
                    <span>{`Оформление документов ${DOCUMENTS_IN_PROGRESS}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#9e9e9e" />
                    <span>{`Недоступно ${UNAVAILABLE}`}</span>
                </FloorLegendItem>
            </StatusesTooltip>
        </FlatStatusesBarContainer>
    );
};
