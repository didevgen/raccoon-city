import {useQuery} from '@apollo/react-hooks';
import React from 'react';
import {useParams} from 'react-router';
import {SelectableGroup} from 'react-selectable-fast/lib';
import styled from 'styled-components';
import {GET_GROUPED_LEVELS} from '../../../graphql/queries/levelQuery';
import {LevelChessGridColumn} from './LevelChessGridColumn/LevelChessGridColumn';
import {Level} from '../../shared/types/level.types';

const ChessGridWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;

interface GroupedLevel {
    id: string;
    level: number;
}

interface GroupedSection {
    id: string;
    section: string;
    levels: GroupedLevel[];
}

const getSelectableGroupRef = (ref: SelectableGroup | null) => {
    (window as any).selectableGroup = ref;
};

interface LevelChessGridProps {
    onSelect: (selection: Level[]) => void;
    levelLayoutId: string;
}
export function LevelChessGrid({onSelect, levelLayoutId}: LevelChessGridProps) {
    const {houseUuid: houseId} = useParams();
    const {data, loading, error} = useQuery(GET_GROUPED_LEVELS, {
        variables: {
            houseId,
            levelLayoutId
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading || error) {
        return null;
    }

    const {getSelectedLevelLayouts} = data;

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
                    onSelect(selection.map((item) => item.props.level));
                }}
            >
                <ChessGridWrapper>
                    {getSelectedLevelLayouts.map((item: GroupedSection) => {
                        return (
                            <LevelChessGridColumn key={item.id} columnName={item.section} levels={item.levels as any} />
                        );
                    })}
                </ChessGridWrapper>
            </SelectableGroup>
        </div>
    );
}
