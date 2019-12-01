import {useQuery} from '@apollo/react-hooks';
import {AppBar, Box, Grid, Theme} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment, useState} from 'react';
import {Redirect, Route, Switch, useParams} from 'react-router';
import {useRouteMatch} from 'react-router-dom';
import {APARTMENT_COMPLEX_IMAGES} from '../../../../graphql/queries/apartmentComplexQuery';
import {ApartmentComplexType, ImageType} from '../../../shared/types/apartmentComplex.types';
import {ApartmentComplexData} from './ApartmentComplexData/ApartmentComplexData';
import {MainApartmentComplexImages} from './MainApartmentComplexImages/MainApartmentComplexImages';
import {Photos} from './Photos/Photos';
import {VRImages} from './VRImages/VRImages';
import {StyledLink} from '../../../shared/components/styled';

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

export function ApartmentComplexInfo() {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const {path, url} = useRouteMatch();
    const {uuid} = useParams();
    if (!uuid) {
        return <Redirect to="/" />;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {loading, error, data} = useQuery<{getApartmentComplex: ApartmentComplexType}>(APARTMENT_COMPLEX_IMAGES, {
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

    const {images, name} = data.getApartmentComplex;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Container maxWidth="lg">
                <Typography variant="h5" gutterBottom={true}>
                    {name}
                </Typography>
                <Grid container={true} spacing={2}>
                    <Grid item={true} xs={3}>
                        <Paper>
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItem button={true}>
                                    <StyledLink to={`${url}`}>
                                        <ListItemText primary="Информация" />
                                    </StyledLink>
                                </ListItem>
                                <ListItem button={true}>
                                    <StyledLink to={`${url}/houses`}>
                                        <ListItemText primary="Дома" />
                                    </StyledLink>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item={true} xs={9}>
                        <div className={classes.root}>
                            <Switch>
                                <Route exact={true} path={path}>
                                    <AppBar position="static" color="default">
                                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                            <Tab label="Информация" />
                                            <Tab label="Главная" />
                                            <Tab label="360" />
                                            <Tab label="180" />
                                            <Tab label="Фото" />
                                        </Tabs>
                                    </AppBar>
                                    <TabPanel value={value} index={0}>
                                        <ApartmentComplexData apartmentComplex={data.getApartmentComplex} />
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <MainApartmentComplexImages images={images} />
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <VRImages uuid={uuid} images={images.VR || []} mode={ImageType.VR} />
                                    </TabPanel>
                                    <TabPanel value={value} index={3}>
                                        <VRImages uuid={uuid} images={images.HALF_VR || []} mode={ImageType.HALF_VR} />
                                    </TabPanel>
                                    <TabPanel value={value} index={4}>
                                        <Photos uuid={uuid} images={images.PHOTO || []} mode={ImageType.PHOTO} />
                                    </TabPanel>
                                </Route>
                                <Route path={`${path}/houses`}>
                                    <div>
                                        <h1>Hello</h1>
                                    </div>
                                </Route>
                            </Switch>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    );
}
