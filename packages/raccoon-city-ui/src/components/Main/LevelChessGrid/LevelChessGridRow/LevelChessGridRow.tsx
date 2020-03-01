import classnames from 'classnames';
import React from 'react';
import {createSelectable, TSelectableItemProps} from 'react-selectable-fast/lib';
import styled from 'styled-components';
import {Level} from '../../../shared/types/level.types';

const Background = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    transition: opacity 200ms linear;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, #c8e6c9 10px, #a5d6a7 20px),
        linear-gradient(to bottom, #81c784, #4caf50);

    &.selected {
        opacity: 1;
        background: repeating-linear-gradient(45deg, transparent, transparent 10px, #c8e6c9 10px, #a5d6a7 20px),
            linear-gradient(to bottom, #81c784, #4caf50);
    }
`;

const RowWrapper = styled.div`
    width: 100%;
    min-width: 120px;
    height: 40px;
    margin: 8px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        ${Background}:not(.selected) {
            opacity: 0.8;
        }
    }
`;

const RowTitle = styled.div`
    width: 32px;
    height: 32px;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
`;

interface ChessGridItem {
    rowName: string;
    level: Level;
}

export function LevelChessGridRowItem(props: ChessGridItem & TSelectableItemProps) {
    return (
        <RowWrapper ref={props.selectableRef}>
            <Background className={classnames({selected: props.isSelected || props.isSelecting})} />
            <RowTitle>{props.rowName}</RowTitle>
        </RowWrapper>
    );
}

export const LevelChessGridRow = createSelectable(LevelChessGridRowItem);
