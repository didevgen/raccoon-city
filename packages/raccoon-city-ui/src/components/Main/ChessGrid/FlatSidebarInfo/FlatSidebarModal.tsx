import React, {useState} from 'react';
import styled from 'styled-components';
import MuiPhoneNumber from 'material-ui-phone-number';
import Recaptcha from 'react-recaptcha';
import {Typography, TextField, Button} from '@material-ui/core';
import {Form, Field} from 'react-final-form';
import {required} from '../../../../utils/validation';

const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001px;
`;

const Modal = styled.div`
    padding: 30px;
    background-color: #fff;
    width: 450px;
`;

export const Input = styled.div`
    margin: 30px 0px;
`;

export const InputError = styled.div`
    margin-bottom: -10px;
    padding-top: 5px;
    font-size: 12px;
    color: #d73c2a;
    text-align: center;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;

    button {
        margin-left: 20px;
    }
`;

export function FlatSidebarModal({close, flat}) {
    const [isVerify, setVerify] = useState(false);

    const onSubmit = (values) => {
        console.log({
            ...flat,
            ...values
        });
    };

    const verifyCallback = () => {
        setVerify(true);
    };

    return (
        <ModalContainer>
            <Modal>
                <Typography>ОСТАВИТЬ ЗАЯВКУ</Typography>
                <Form
                    subscription={{invalid: true}}
                    onSubmit={onSubmit}
                    render={({handleSubmit, invalid}) => (
                        <form onSubmit={handleSubmit}>
                            <Input>
                                <Field name="name" validate={required}>
                                    {({input, meta}) => (
                                        <div>
                                            <TextField
                                                label="Имя"
                                                margin="normal"
                                                fullWidth={true}
                                                variant="outlined"
                                                {...input}
                                            />
                                            {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
                                        </div>
                                    )}
                                </Field>
                            </Input>
                            <Input>
                                <Field name="phone" validate={required}>
                                    {({input, meta}) => (
                                        <div>
                                            <MuiPhoneNumber
                                                fullWidth
                                                preferredCountries={['ua']}
                                                regions={'europe'}
                                                defaultCountry="ua"
                                                label={'Телефон'}
                                                variant="outlined"
                                                {...input}
                                            />
                                            {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
                                        </div>
                                    )}
                                </Field>
                            </Input>
                            <div>
                                <Recaptcha
                                    sitekey="6LdkbboZAAAAAN21lpRJbyEv9YNj5mbg-cb37Ws_"
                                    render="explicit"
                                    verifyCallback={verifyCallback}
                                />
                            </div>
                            <ButtonsContainer>
                                <Button variant="outlined" color="primary" onClick={() => close(false)}>
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="primary"
                                    disabled={invalid || !isVerify}
                                >
                                    {console.log('flat')}
                                    {console.log(flat)}
                                    Отправить
                                </Button>
                            </ButtonsContainer>
                        </form>
                    )}
                />
            </Modal>
        </ModalContainer>
    );
}
