import Typography from '@material-ui/core/Typography';
import {Box} from '@material-ui/core';
import * as React from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

export function TabPanel(props: TabPanelProps) {
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
