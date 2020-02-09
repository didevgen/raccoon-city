import {useQuery} from '@apollo/react-hooks';
import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {GET_GROUPED_FLATS, GetGroupedFlatsBySectionQuery, GroupedFlats} from '../../../graphql/queries/houseQuery';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';

const ChessGridWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;

export function LayoutChessGrid() {
    const {houseUuid: uuid} = useParams();
    const {loading, error, data} = useQuery<GetGroupedFlatsBySectionQuery>(GET_GROUPED_FLATS, {
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

    if (!data || !data.getGroupedFlatsBySection) {
        return <span>no data...</span>;
    }

    const {getGroupedFlatsBySection: groupedFlats} = data;

    if (groupedFlats && groupedFlats.length === 0) {
        return <span>В данном доме еще нет квартир</span>;
    }

    return (
        <div>
            <ChessGridWrapper>
                {groupedFlats.map((item: GroupedFlats) => {
                    return <ChessGridColumn key={item.id} columnName={item.section} levels={item.levels} />;
                })}
            </ChessGridWrapper>
        </div>
    );
}
