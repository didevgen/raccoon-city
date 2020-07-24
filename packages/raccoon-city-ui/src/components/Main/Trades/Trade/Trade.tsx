import {useQuery} from '@apollo/react-hooks';
import {Grid, Slide} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import styled from 'styled-components';
import {GET_TRADE} from '../../../../graphql/queries/tradeQuery';
import {Notes} from './Notes';
import {TradeForm} from './TradeForm';

const ContactsWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const Transition: any = React.forwardRef((props: any, ref: React.Ref<unknown>) => (
    <Slide direction="left" ref={ref} {...props} />
));

interface TradePropsInterface {
    open: any;
    handleClose: any;
    uuid: any;
    contact?: any;
}

export const Trade = ({open, handleClose, uuid, contact}: TradePropsInterface) => {
    const {data, error, loading} = useQuery(GET_TRADE, {
        variables: {
            uuid
        },
        fetchPolicy: 'cache-and-network',
        skip: !uuid
    });

    if (error || loading) {
        return null;
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <ContactsWrapper>
                <Grid container spacing={1}>
                    <Grid item md={4} xs={12}>
                        <TradeForm onClose={handleClose} trade={data?.getTrade} contact={contact} />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Notes />
                    </Grid>
                </Grid>
            </ContactsWrapper>
        </Dialog>
    );
};

export default Trade;
