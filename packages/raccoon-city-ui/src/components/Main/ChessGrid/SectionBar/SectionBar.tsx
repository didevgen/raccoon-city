import {useQuery} from '@apollo/react-hooks';
import {AppBar} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import React, {useState} from 'react';
import {useParams} from 'react-router';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import {APARTMENT_COMPLEX_INFO} from '../../../../graphql/queries/apartmentComplexQuery';
import {ApartmentComplexType, ImageType} from '../../../shared/types/apartmentComplex.types';
import {ApartmentComplexData} from '../../ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexData/ApartmentComplexData';
import {TabPanel} from '../../ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexInfo';
import {SidebarVRDialog} from '../FlatSidebarInfo/SidebarVRDialog';
import {
    AppBarContainer,
    CloseBarContainer,
    CustomSlider,
    SectionBarContainer,
    SideBarImage,
    SideBarVRImage,
    SliderContainer,
    TabPanelContainer
} from './SectionBar.styled';

function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div className={` slick-next-arrow ${className}`} style={{...style, display: 'flex'}} onClick={onClick}>
            <ArrowRightIcon />
        </div>
    );
}
function SamplePrevArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div className={` slick-prev-arrow ${className}`} style={{...style, display: 'flex'}} onClick={onClick}>
            <ArrowLeftIcon />
        </div>
    );
}

const sliderSettings = {
    dots: false,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
};

// TODO add error handle
export const SectionBar = (props: any) => {
    const {isSideBarOpen, setSideBarOpen} = props;

    const {apartmentComplexUuid} = useParams();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [downloadLink, setDownloadLink] = React.useState('');
    const [name, setName] = React.useState('');

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const {loading, error, data} = useQuery<{getApartmentComplex: ApartmentComplexType}>(APARTMENT_COMPLEX_INFO, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: apartmentComplexUuid
        }
    });

    if (loading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error :(</div>;
    }

    if (!data || !apartmentComplexUuid) {
        return <div>Error</div>;
    }

    const {images} = data.getApartmentComplex;

    const photosJSX = images?.PHOTO?.map(({downloadUrl, uuid}) => (
        <SideBarImage key={uuid} src={downloadUrl} alt="house image" />
    ));

    return (
        <SectionBarContainer isSideBarOpen={isSideBarOpen}>
            <CloseBarContainer>
                <CloseIcon onClick={() => setSideBarOpen(false)} />
            </CloseBarContainer>

            <SliderContainer>
                <CustomSlider {...sliderSettings}>{photosJSX}</CustomSlider>
            </SliderContainer>

            <AppBarContainer>
                <AppBar position="static" color="default">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Информация" />
                        <Tab label="360" />
                        <Tab label="Фото" />
                    </Tabs>
                </AppBar>
            </AppBarContainer>
            <TabPanelContainer value={value} index={0}>
                <ApartmentComplexData apartmentComplex={data.getApartmentComplex} />
            </TabPanelContainer>
            <TabPanel value={value} index={1}>
                {!images?.VR ? (
                    <div>Нет VR фото</div>
                ) : (
                    images.VR.map(({downloadUrl, uuid, name}) => (
                        <SideBarVRImage
                            key={uuid}
                            src={downloadUrl}
                            alt="house image"
                            onClick={() => {
                                setDownloadLink(downloadUrl);
                                setName(name);
                                setOpen(true);
                            }}
                        />
                    ))
                )}
            </TabPanel>
            <TabPanelContainer value={value} index={2}>
                {!images?.PHOTO ? (
                    <div>Нет фото</div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto'}}>
                        {photosJSX}
                    </div>
                )}
            </TabPanelContainer>

            <SidebarVRDialog
                setOpen={setOpen}
                open={open}
                mode={ImageType.VR}
                downloadLink={downloadLink}
                name={name}
            />
        </SectionBarContainer>
    );
};
