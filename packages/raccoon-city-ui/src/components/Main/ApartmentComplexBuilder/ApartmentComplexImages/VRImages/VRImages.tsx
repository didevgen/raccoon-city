import {Button} from '@material-ui/core';
import * as React from 'react';
import {Fragment} from 'react';
import {VRDialog} from '../VRDialog/VRDialog';

export function VRImages() {
    const [open, setOpen] = React.useState(false);
    return (
        <Fragment>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
                variant="contained"
            >
                Default
            </Button>
            <VRDialog setOpen={setOpen} open={open} />
        </Fragment>
    );
}
