import {AppBar, Tab, Tabs} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ThreeDRotationIcon from '@material-ui/icons/ThreeDRotation';
import React from 'react';
import styled from 'styled-components';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import PrintIcon from '@material-ui/icons/Print';
import {Flat} from '../../../shared/types/flat.types';
import {FlatSidebarData} from './FlatSidebarData';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import {ImageViewVR} from './ImageViewVR';
import {ImageViewPhotos} from './ImageViewPhotos';
const FlatSidebarWrapper = styled.div`
    padding: 16px;
    width: 420px;
`;

const ImageContainer = styled.div`
    max-width: 420px;
    .FlatSidebarInfo__image {
        width: 100%;
    }
`;

const FlatInfoLine = styled.div`
    display: flex;
    justify-content: space-between;
    .FlatInfoItem__label {
        font-weight: 500;
    }
    padding-bottom: 8px;
    padding-top: 8px;
    border-bottom: 1px solid #000;
`;

interface FlatSidebarInfoProps {
    flat: Flat;
}

const StyledTab = styled(Tab)`
    min-width: 48px !important;
`;
export function FlatSidebarInfo(props: FlatSidebarInfoProps) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const {flat} = props;
    return (
        <FlatSidebarWrapper>
            {flat.layout && (
                <ImageContainer>
                    <img
                        className="FlatSidebarInfo__image"
                        src={flat.layout?.image.previewImageUrl}
                        alt={flat.layout?.name}
                    />
                </ImageContainer>
            )}
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    centered
                    aria-label="scrollable prevent tabs example"
                >
                    <StyledTab icon={<InfoIcon />} aria-label="phone" />
                    <StyledTab icon={<ThreeDRotationIcon />} aria-label="3d" />
                    <StyledTab icon={<ThreeSixtyIcon />} aria-label="2d" />
                    <StyledTab icon={<ImageIcon />} aria-label="gallery" />
                    <StyledTab icon={<ViewCompactIcon />} aria-label="layout" />
                    <StyledTab icon={<PrintIcon />} aria-label="print" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <FlatSidebarData flat={flat} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ImageViewVR images={flat.layout?.images?.VR} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ImageViewVR images={flat.layout?.images?.HALF_VR} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <ImageViewPhotos images={flat.layout?.images?.PHOTO} />
            </TabPanel>
        </FlatSidebarWrapper>
    );
}
