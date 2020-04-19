import {useQuery} from '@apollo/react-hooks';
import {AppBar} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, {Fragment} from 'react';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {GET_LAYOUT, GetLayoutQuery} from '../../../../graphql/queries/layoutQuery';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {ImageType} from '../../../shared/types/apartmentComplex.types';
import {FlatLayoutData} from '../FlatLayoutData/FlatLayoutData';
import {Photos} from '../Photos/Photos';
import {VRImages} from '../VRImages/VRImages';

export function FlatLayouInfo() {
    const {layoutId} = useParams();
    const [value, setValue] = useState(0);

    const {data, loading, error, refetch} = useQuery<GetLayoutQuery>(GET_LAYOUT, {
        variables: {
            layoutId
        }
    });

    if (!layoutId) {
        return null;
    }

    if (loading) {
        return <span>Loading</span>;
    }

    if (error || !data) {
        return <span>Error</span>;
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const {images} = data.getFlatLayout;
    return (
        <Fragment>
            <AppBar position="static" color="default">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Информация" />
                    <Tab label="360" />
                    <Tab label="180" />
                    <Tab label="Фото" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <FlatLayoutData flatLayout={data?.getFlatLayout} refetch={refetch} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <VRImages uuid={layoutId} images={images.VR || []} mode={ImageType.VR} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <VRImages uuid={layoutId} images={images.HALF_VR || []} mode={ImageType.HALF_VR} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Photos uuid={layoutId} images={images.PHOTO || []} mode={ImageType.PHOTO} />
            </TabPanel>
        </Fragment>
    );
}
