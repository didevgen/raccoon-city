import {Slide} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import styled from 'styled-components';
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

export const Contact = ({open, handleClose}) => (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <ContactsWrapper>
            <ContactForm onClose={handleClose} />
            <Notes />
        </ContactsWrapper>
    </Dialog>
);

export default Contact;
