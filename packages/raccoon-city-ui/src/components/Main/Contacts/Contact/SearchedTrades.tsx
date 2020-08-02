import React, {useState, useEffect, useRef} from 'react';
import ContactOneTrade from './ContactOneTrade';
import {Waypoint} from 'react-waypoint';
import {getAppropriateItems} from './ContactTradesUtils';
import {itemsToLoad} from './ContactTrades';

export const SearchedTrades = ({searchResult, dropdowns, editTrade, deleteTrade}) => {
    const checkMountingRef = useRef<any>();

    useEffect(() => {
        if (start === 0 && checkMountingRef.current && searchResult.length > 0) {
            loadMore();
        }
    });

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

    return (
        <>
            <div ref={checkMountingRef}>
                {searchResult.length === 0
                    ? null
                    : loadedItems.map((item: any, index) =>
                          !searchResult[index] ? null : (
                              <React.Fragment key={searchResult[item].id}>
                                  <ContactOneTrade
                                      dropdowns={dropdowns}
                                      item={searchResult[item]}
                                      editTrade={editTrade}
                                      deleteTrade={deleteTrade}
                                  />
                                  {index === loadedItems.length - 1 && stop <= searchResult.length && (
                                      <Waypoint onEnter={loadMore} />
                                  )}
                              </React.Fragment>
                          )
                      )}
            </div>
        </>
    );
};
