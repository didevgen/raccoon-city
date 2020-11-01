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
        variables: {
            uuid: houseId[0]
        }
    });

    if (loading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    const {countPublicFlats} = data;

    console.log(countPublicFlats);

    let allFlats = 0;
    const updatedValues = countPublicFlats.reduce((acc, {label, count}) => {
        allFlats += count;
        return {...acc, [label]: count};
    }, {});

    return (
        <FlatStatusesBarContainer>
            <StatusesIcon>
                <span>?</span>
            </StatusesIcon>

            <StatusesTooltip>
                <p>{`Найдено ${allFlats} помещений из них свободно ${updatedValues['FREE']}`}</p>

                <FloorLegendItem>
                    <FloorLegendIcon color="#4caf50" />
                    <span>{`Свободно ${updatedValues['FREE']}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#ffeb3b" />
                    <span>{`Резерв\\Забронировано ${updatedValues['RESERVED']}\\${updatedValues['BOOKED']}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#f44336" />
                    <span>{`Продано ${updatedValues['SOLD_OUT']}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#00bcd4" />
                    <span>{`Оформление документов ${updatedValues['DOCUMENTS_IN_PROGRESS']}`}</span>
                </FloorLegendItem>
                <FloorLegendItem>
                    <FloorLegendIcon color="#9e9e9e" />
                    <span>{`Недоступно ${updatedValues['UNAVAILABLE']}`}</span>
                </FloorLegendItem>
            </StatusesTooltip>
        </FlatStatusesBarContainer>
    );
};
