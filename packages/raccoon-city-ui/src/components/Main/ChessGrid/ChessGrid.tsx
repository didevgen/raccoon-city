import {useQuery} from '@apollo/react-hooks';
import {Drawer} from '@material-ui/core';
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {GET_GROUPED_FLATS, GetGroupedFlatsBySectionQuery, GroupedFlats} from '../../../graphql/queries/houseQuery';
import {Flat} from '../../shared/types/flat.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {FlatSidebarInfo} from './FlatSidebarInfo/FlatSidebarInfo';

const ChessGridWrapper = styled.div`
    width: 100%;
    overflow-y: scroll;
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;
export function ChessGrid() {
    const {houseUuid: uuid} = useParams();
    const {loading, error, data} = useQuery<GetGroupedFlatsBySectionQuery>(GET_GROUPED_FLATS, {
        variables: {
            uuid
        },
        fetchPolicy: 'cache-and-network'
    });
    const [flatCardOpen, setFlatCardOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState<Flat>();

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
        <ChessGridWrapper>
            {groupedFlats.map((item: GroupedFlats) => {
                return (
                    <ChessGridColumn
                        key={item.id}
                        columnName={item.section}
                        levels={item.levels}
                        onSelect={(flat: Flat) => {
                            setSelectedFlat(flat);
                            setFlatCardOpen(true);
                        }}
                    />
                );
            })}
            <Drawer
                anchor="right"
                open={flatCardOpen}
                onClose={() => {
                    setFlatCardOpen(false);
                    setSelectedFlat(undefined);
                }}
            >
                {selectedFlat && <FlatSidebarInfo flat={selectedFlat} />}
            </Drawer>
        </ChessGridWrapper>
    );
}
