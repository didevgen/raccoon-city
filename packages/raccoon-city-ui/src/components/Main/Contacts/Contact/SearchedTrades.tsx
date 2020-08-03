import React, {useState, useRef, Fragment} from 'react';
import ContactOneTrade from './ContactOneTrade';
import {Waypoint} from 'react-waypoint';
import {getAppropriateItems} from './ContactTradesUtils';
import {itemsToLoad} from './ContactTrades';

export const SearchedTrades = ({searchResult, dropdowns, editTrade, deleteTrade}) => {
    const checkMountingRef = useRef<any>();

    const [loadedItems, setLoadedItems] = useState<string[]>([]);
    const [start, setStart] = useState(0);
    const [stop, setStop] = useState(itemsToLoad - 1);

    function getNewItems() {
        const filteredItems = getAppropriateItems(searchResult, start, stop);

        const newItems: any = [...loadedItems, ...filteredItems];

        setLoadedItems(newItems);
    }

    function loadMore() {
        getNewItems();
        setStart(start + itemsToLoad);
        setStop(stop + itemsToLoad);
    }

    if (start === 0 && checkMountingRef.current && searchResult.length > 0) {
        loadMore();
    }

    return (
        <Fragment>
            <div ref={checkMountingRef}>
                {searchResult.length === 0
                    ? null
                    : loadedItems.map((item: any, index) =>
                          !searchResult[index] ? null : (
                              <Fragment key={searchResult[item].id}>
                                  <ContactOneTrade
                                      dropdowns={dropdowns}
                                      item={searchResult[item]}
                                      editTrade={editTrade}
                                      deleteTrade={deleteTrade}
                                  />
                                  {index === loadedItems.length - 1 && stop <= searchResult.length && (
                                      <Waypoint onEnter={loadMore} />
                                  )}
                              </Fragment>
                          )
                      )}
            </div>
        </Fragment>
    );
};
