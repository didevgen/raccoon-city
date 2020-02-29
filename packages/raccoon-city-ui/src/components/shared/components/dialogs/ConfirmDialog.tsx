import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {Fragment} from 'react';

export function Confirmation(props: any) {
    const [open, setOpen] = React.useState(false);
    const [callbackFn, setCallbackFn] = React.useState<any>();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const confirmFn = (callback: () => void) => {
        handleClickOpen();
        setCallbackFn(callback);
    };
    return (
        <Fragment>
            {props.children(confirmFn)}
            <ConfirmDialog
                open={open}
                title={props.title}
                text={props.text}
                cancel={handleClose}
                accept={() => {
                    callbackFn();
                    handleClose();
                }}
            />
        </Fragment>
    );
}

function ConfirmDialog({open, cancel, accept, text, title}: any) {
    const heading = title ? title : 'Вы уверены?';
    const mainText = text ? text : 'Данная операция не сможет быть отменена';
    return (
        <Dialog open={open} onClose={cancel} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{heading}</DialogTitle>
            <DialogContent>
                <DialogContentText>{mainText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus={true}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        cancel();
                    }}
                    color="primary"
                >
                    Отмена
                </Button>
                <Button
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        accept();
                    }}
                    color="primary"
                    autoFocus={true}
                >
                    Да
                </Button>
            </DialogActions>
        </Dialog>
    );
}
