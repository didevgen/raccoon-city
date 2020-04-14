import {useQuery} from '@apollo/react-hooks';
import {AppBar, Grid, Theme} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import {Fragment, useState} from 'react';
import * as React from 'react';
import {Redirect, Route, Switch, useParams} from 'react-router';
import {useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import {HOUSE_INFO} from '../../../../graphql/queries/houseQuery';
import {StyledNavLink} from '../../../shared/components/styled';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {ImageType} from '../../../shared/types/apartmentComplex.types';
import {House} from '../../../shared/types/house.types';
import {LayoutEditor} from '../../LayoutEditor/LayoutEditor';
import {LevelLayoutEditor} from '../../LevelEditor';
import {HouseEditor} from '../HouseEditor/HouseEditor';
import {MainHouseImages} from './MainHouseImages/MainHouseImages';
import {Photos} from './Photos/Photos';
import {VRImages} from './VRImages/VRImages';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
        width: '100%'
    }
}));

const StyledLink = styled(StyledNavLink)`
    &.Mui-selected > div {
        color: white;
        background-color: #3f51b5;
        &:hover {
            background-color: #7986cb;
        }
    }
`;

export function HouseInfo() {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const {path, url} = useRouteMatch();
    const {houseUuid: uuid} = useParams();
    if (!uuid) {
        return <Redirect to="/" />;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {loading, error, data} = useQuery<{getHouse: House}>(HOUSE_INFO, {
        fetchPolicy: 'network-only',
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

    if (!data.getHouse) {
        return <Redirect to="/" />;
    }

    const {name, images, address, parking, price} = data.getHouse;

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
                                <StyledLink activeClassName="Mui-selected" to={`${url}/info`}>
                                    <ListItem button={true}>
                                        <ListItemText primary="Информация" />
                                    </ListItem>
                                </StyledLink>
                                <StyledLink activeClassName="Mui-selected" to={`/houseGrid/${uuid}`}>
                                    <ListItem button={true}>
                                        <ListItemText primary="Просмотр шахматки" />
                                    </ListItem>
                                </StyledLink>
                                <StyledLink activeClassName="Mui-selected" to={`${url}/editor`}>
                                    <ListItem button={true}>
                                        <ListItemText primary="Редактор помещений" />
                                    </ListItem>
                                </StyledLink>
                                <StyledLink activeClassName="Mui-selected" to={`${url}/levels`}>
                                    <ListItem button={true}>
                                        <ListItemText primary="Планировка этажей" />
                                    </ListItem>
                                </StyledLink>
                                <StyledLink activeClassName="Mui-selected" to={`${url}/layout`}>
                                    <ListItem button={true}>
                                        <ListItemText primary="Планировка квартир" />
                                    </ListItem>
                                </StyledLink>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item={true} xs={9}>
                        <div className={classes.root}>
                            <Switch>
                                <Route exact={true} path={`${path}/info`}>
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
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2" component="p">
                                                            Название дома
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" component="p">
                                                            {name}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2" component="p">
                                                            Строительный адрес
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" component="p">
                                                            {address}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2" component="p">
                                                            Стоимость квартир в доме
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" component="p">
                                                            {price}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2" component="p">
                                                            Парковка
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" component="p">
                                                            {parking ? 'Есть' : 'Нет'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <MainHouseImages images={images} />
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
                                <Route exact path={`${path}/editor`}>
                                    <HouseEditor />
                                </Route>
                                <Route exact path={`${path}/levels`}>
                                    <LevelLayoutEditor />
                                </Route>
                                <Route exact path={`${path}/layout`}>
                                    <LayoutEditor />
                                </Route>
                            </Switch>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    );
}
