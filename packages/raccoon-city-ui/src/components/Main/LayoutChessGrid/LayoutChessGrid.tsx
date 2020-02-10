import {useQuery} from '@apollo/react-hooks';
import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {GET_GROUPED_FLATS, GetGroupedFlatsBySectionQuery, GroupedFlats} from '../../../graphql/queries/houseQuery';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {SelectableGroup} from 'react-selectable-fast';
import {Flat} from '../../shared/types/flat.types';

const ChessGridWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;

const getSelectableGroupRef = (ref: SelectableGroup | null) => {
    (window as any).selectableGroup = ref;
};

interface LayoutChessGridProps {
    onSelect: (selection: Flat[]) => void;
}
export const LayoutChessGrid = React.memo((props: LayoutChessGridProps) => {
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
            <SelectableGroup
                ref={getSelectableGroupRef}
                className="main"
                clickClassName="tick"
                enableDeselect={true}
                tolerance={0}
                deselectOnEsc={true}
                allowClickWithoutSelected={false}
                ignoreList={['.not-selectable']}
                onSelectionFinish={(selection: any[]) => {
                    props.onSelect(selection.map((item) => item.props.flat));
                }}
            >
                <ChessGridWrapper>
                    {groupedFlats.map((item: GroupedFlats) => {
                        return <ChessGridColumn key={item.id} columnName={item.section} levels={item.levels} />;
                    })}
                </ChessGridWrapper>
            </SelectableGroup>
        </div>
    );
});
