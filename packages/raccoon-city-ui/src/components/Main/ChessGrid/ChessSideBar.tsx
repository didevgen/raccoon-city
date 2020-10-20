import React from 'react';
import {FlatSidebarInfo} from './FlatSidebarInfo/FlatSidebarInfo';

interface ChessSideBarProps {
    SideBar: any;
    flatCardOpen: boolean;
    isPublic: boolean;

    selectedFlat: any;
    showRequestButton: any;
    onFlatSelected: any;
    setFlatCardOpen: any;
    setSelectedFlat: any;
}

export const ChessSideBar = ({
    SideBar,
    flatCardOpen,
    isPublic,
    selectedFlat,
    showRequestButton,
    onFlatSelected,
    setFlatCardOpen,
    setSelectedFlat
}: ChessSideBarProps) => {
    return (
        <SideBar
            anchor="right"
            open={flatCardOpen}
            onOpen={() => {
                // silence
            }}
            onClose={() => {
                setFlatCardOpen(false);
                setSelectedFlat(undefined);
            }}
        >
            {selectedFlat && (
                <FlatSidebarInfo
                    // @ts-ignore
                    flat={selectedFlat}
                    isPublic={isPublic}
                    showRequestButton={showRequestButton}
                    onFlatSelected={onFlatSelected}
                />
            )}
        </SideBar>
    );
};
