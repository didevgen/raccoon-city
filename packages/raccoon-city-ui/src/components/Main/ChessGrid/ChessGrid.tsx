import {useQuery} from '@apollo/react-hooks';
import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {GET_GROUPED_FLATS, GetGroupedFlatsByEntranceQuery, GroupedFlats} from '../../../graphql/queries/houseQuery';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';

const ChessGridWrapper = styled.div`
    width: 100%;
    overflow-y: scroll;
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;
export function ChessGrid() {
    const {houseUuid: uuid} = useParams();
    const {loading, error, data} = useQuery<GetGroupedFlatsByEntranceQuery>(GET_GROUPED_FLATS, {
        variables: {
            uuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return <span>loading...</span>;
    }

    if (error) {
        return <span>error...</span>;
    }

    if (!data || !data.getGroupedFlatsByEntrance) {
        return <span>no data...</span>;
    }

    const {getGroupedFlatsByEntrance: groupedFlats} = data;

    if (groupedFlats && groupedFlats.length === 0) {
        return <span>В данном доме еще нет квартир</span>;
    }

    return (
        <ChessGridWrapper>
            {groupedFlats.map((item: GroupedFlats) => {
                return (
                    <ChessGridColumn key={`entrance${item.entrance}`} columnName={item.entrance} level={item.level} />
                );
            })}
        </ChessGridWrapper>
    );
}
