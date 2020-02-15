import {useQuery} from '@apollo/react-hooks';
import React from 'react';
import {useParams} from 'react-router-dom';
import {SelectableGroup} from 'react-selectable-fast';
import styled from 'styled-components';
import {GroupedFlats} from '../../../graphql/queries/houseQuery';
import {GET_GROUPED_FLATS_WITH_LAYOUT, GetGroupedFlatsWithLayoutQuery} from '../../../graphql/queries/layoutQuery';
import {Flat} from '../../shared/types/flat.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';

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
    layoutId: string;
}
export const LayoutChessGrid = React.memo((props: LayoutChessGridProps) => {
    const {houseUuid: houseId} = useParams();
    const {loading, error, data} = useQuery<GetGroupedFlatsWithLayoutQuery>(GET_GROUPED_FLATS_WITH_LAYOUT, {
        variables: {
            houseId,
            layoutId: props.layoutId
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return <span>loading...</span>;
    }

    if (error) {
        return <span>error...</span>;
    }

    if (!data || !data.getChessGridLayout) {
        return <span>no data...</span>;
    }

    const {getChessGridLayout: groupedFlats} = data;

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
