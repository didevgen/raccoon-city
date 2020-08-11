import {useQuery} from '@apollo/react-hooks';
import {AppBar, Button, Chip, Tab, Tabs, Typography} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import PrintIcon from '@material-ui/icons/Print';
import ThreeDRotationIcon from '@material-ui/icons/ThreeDRotation';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import React from 'react';
import styled from 'styled-components';
import {
    GET_FLAT_SIDEBAR_DATA,
    GET_PUBLIC_FLAT_SIDEBAR_DATA,
    GetFlatSidebarDataQuery
} from '../../../../graphql/queries/flatQuery';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {ImageType} from '../../../shared/types/apartmentComplex.types';
import {Flat} from '../../../shared/types/flat.types';
import {FlatSidebarData} from './FlatSidebarData';
import {ImageViewPhotos} from './ImageViewPhotos';
import {ImageViewVR} from './ImageViewVR';
import {LayoutView} from './LayoutView';
import {SidebarPdfInfo} from './SidebarPdfInfo';
import FlatSidebarModal from './FlatSidebarModal';
import {BrowserRouterProps, withRouter} from 'react-router-dom';

const FlatSidebarWrapper = styled.div`
    padding: 16px;
    width: 420px;
    max-width: 100vw;
`;

const ImageContainer = styled.div`
    max-width: 420px;
    .FlatSidebarInfo__image {
        width: 100%;
    }
`;

const FlatTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const SaleChip = styled(Chip)`
    font-weight: bold;
    border-radius: 0 !important;
`;

const SendRequestContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0px 15px;
`;

interface FlatSidebarInfoProps extends BrowserRouterProps {
    flat: Flat;
    isPublic: boolean;
    onFlatSelected?: (flat: Flat) => void;
    match: any;
}

const StyledTab = styled(Tab)`
    min-width: 48px !important;
`;
function FlatSidebarInfo(props: FlatSidebarInfoProps) {
    const {data, loading, error} = useQuery<GetFlatSidebarDataQuery>(
        props.isPublic ? GET_PUBLIC_FLAT_SIDEBAR_DATA : GET_FLAT_SIDEBAR_DATA,
        {
            variables: {
                flatId: props.flat.id
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    const [value, setValue] = React.useState(0);
    const [isModalOpen, setModalOpen] = React.useState(false);

    if (loading || !data) {
        return <span>loading</span>;
    }

    if (error) {
        return <span>error</span>;
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const flat = data.getFlatSidebarInfo;

    return (
        <FlatSidebarWrapper>
            <FlatTitleContainer>
                <Typography variant="h5" gutterBottom>
                    Квартира № {flat.flatNumber}
                </Typography>
                {!!flat.sale && <SaleChip label="Акция" color="secondary" />}
            </FlatTitleContainer>
            {props.onFlatSelected && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        // @ts-ignore
                        props.onFlatSelected(flat);
                    }}
                >
                    Выбрать квартиру
                </Button>
            )}
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
                {value === 0 && <FlatSidebarData flat={flat} />}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {value === 1 && <ImageViewVR images={flat.layout?.images?.VR} mode={ImageType.VR} />}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {value === 2 && <ImageViewVR images={flat.layout?.images?.HALF_VR} mode={ImageType.HALF_VR} />}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {value === 3 && <ImageViewPhotos images={flat.layout?.images?.PHOTO} />}
            </TabPanel>
            <TabPanel value={value} index={4}>
                {value === 4 && <LayoutView levelLayouts={flat.levelLayouts} />}
            </TabPanel>
            <TabPanel value={value} index={5}>
                {value === 5 && <SidebarPdfInfo flat={flat} />}
            </TabPanel>
            {!!props.isPublic && (
                <SendRequestContainer>
                    <Button variant="outlined" color="primary" onClick={() => setModalOpen(!isModalOpen)}>
                        Оставить заявку
                    </Button>
                </SendRequestContainer>
            )}
            {isModalOpen && props.match.path.split('/')[1] === 'public' && (
                <FlatSidebarModal flat={flat} close={setModalOpen} />
            )}
        </FlatSidebarWrapper>
    );
}

// @ts-ignore
export default withRouter(FlatSidebarInfo);
