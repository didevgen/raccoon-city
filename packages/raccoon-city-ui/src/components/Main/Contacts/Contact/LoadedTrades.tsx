import React from 'react';
import ContactOneTrade from './ContactOneTrade';
import {Waypoint} from 'react-waypoint';

export const LoadedTrades = ({loadedItems, tradesToShow, dropdowns, editTrade, deleteTrade, loadMore, stop}) => {
    return loadedItems.map((item: any, index) =>
        !tradesToShow[index] ? null : (
            <React.Fragment key={tradesToShow[item].id}>
                <ContactOneTrade
                    dropdowns={dropdowns}
                    item={tradesToShow[item]}
                    editTrade={editTrade}
                    deleteTrade={deleteTrade}
                />
                {index === loadedItems.length - 1 && stop <= tradesToShow.length && <Waypoint onEnter={loadMore} />}
            </React.Fragment>
        )
    );
};
