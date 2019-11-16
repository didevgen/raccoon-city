import {AppBar, Box, Theme} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment} from 'react';

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
    const [value, setValue] = React.useState(0);

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
                            <Tab label="Видео" />
                            <Tab label="Фото" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        Item One
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        Item 4
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        Item 5
                    </TabPanel>
                </div>
            </Container>
        </Fragment>
    );
}
