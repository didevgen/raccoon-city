import {useQuery} from '@apollo/react-hooks';
import {AppBar, Box, Theme} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment, useState} from 'react';
import {Redirect, useParams} from 'react-router';
import {ApartmentComplex} from '../../../../../../raccoon-city-graphql/src/db/models/apartmentComplex';
import {APARTMENT_COMPLEX_IMAGES} from '../../../../graphql/queries/apartmentComplexQuery';
import {ImageType} from '../../../shared/types/apartmentComplex.types';
import {MainApartmentComplexImages} from './MainApartmentComplexImages/MainApartmentComplexImages';
import {VRImages} from './VRImages/VRImages';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        width: '100%'
    }
}));

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

export function ApartmentComplexImages() {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const {uuid} = useParams();
    if (!uuid) {
        return <Redirect to="/" />;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {loading, error, data} = useQuery<{getApartmentComplex: ApartmentComplex}>(APARTMENT_COMPLEX_IMAGES, {
        variables: {
            uuid
        }
    });

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !data) {
        return <p>Error :(</p>;
    }

    if (!data.getApartmentComplex) {
        return <Redirect to="/" />;
    }

    const images = data.getApartmentComplex.images;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Container maxWidth="lg">
                <Typography variant="h5" gutterBottom={true}>
                    Создание комплекса
                </Typography>
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="Главная" />
                            <Tab label="360" />
                            <Tab label="180" />
                            <Tab label="Фото" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <MainApartmentComplexImages images={images} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <VRImages uuid={uuid} images={images.VR || []} mode={ImageType.VR} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <VRImages uuid={uuid} images={images.HALF_VR || []} mode={ImageType.HALF_VR} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        Item 4
                    </TabPanel>
                </div>
            </Container>
        </Fragment>
    );
}
