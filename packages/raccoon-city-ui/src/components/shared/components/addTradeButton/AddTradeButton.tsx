import React from 'react';
import {AddTradeContainer, AddTradeIcon} from './AddTradeButton.styles';

export function AddTradeButton() {
    return (
        <AddTradeContainer>
            <AddTradeIcon />
            <div>Добавить сделку</div>
        </AddTradeContainer>
    );
}
