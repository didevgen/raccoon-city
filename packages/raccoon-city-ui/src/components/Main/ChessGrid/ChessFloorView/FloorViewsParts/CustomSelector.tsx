import React from 'react';
import {MenuItem} from '@material-ui/core';
import {SelectWrapper, CustomSelect} from '../ChessFloorView.styled';

interface CustomSelectorProps {
    currentValue: string;
    setValue: any;
    isPublic: boolean;
    itemName?: string;
    items: any;
    keyToShow: any;
}

export const CustomSelector = ({currentValue, setValue, isPublic, items, itemName, keyToShow}: CustomSelectorProps) => (
    <SelectWrapper {...{isPublic}}>
        <CustomSelect {...{isPublic}} value={currentValue}>
            {items.map((item: any) => {
                return (
                    <MenuItem key={item.id} value={item.id} onClick={() => setValue(item.id)}>
                        {`${itemName} ${item[keyToShow]}`}
                    </MenuItem>
                );
            })}
        </CustomSelect>
    </SelectWrapper>
);
