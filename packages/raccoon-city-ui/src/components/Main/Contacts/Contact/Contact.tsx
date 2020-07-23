import {useQuery} from '@apollo/react-hooks';
import {Slide} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import styled from 'styled-components';
import {GET_CONTACT} from '../../../../graphql/queries/contactQuery';
import {ContactForm} from './ContactForm';
import {Notes} from './Notes';

const ContactsWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const Transition: any = React.forwardRef((props: any, ref: React.Ref<unknown>) => (
    <Slide direction="left" ref={ref} {...props} />
));

export const Contact = ({open, handleClose, uuid}) => {
    const {data, error, loading} = useQuery(GET_CONTACT, {
        variables: {
            uuid
        },
        fetchPolicy: 'cache-and-network',
        skip: !uuid
    });

    if (error || loading) {
        return null;
    }

    if (!open || !uuid) {
        return null;
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <ContactsWrapper>
                <ContactForm onClose={handleClose} contact={data?.getContact} />
                <Notes />
            </ContactsWrapper>
        </Dialog>
    );
};

export default Contact;
