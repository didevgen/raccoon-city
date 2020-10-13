import React, {useState} from 'react';
import styled from 'styled-components';
import MuiPhoneNumber from 'material-ui-phone-number';
import Recaptcha from 'react-recaptcha';
import {Typography, TextField, Button} from '@material-ui/core';
import {Form, Field} from 'react-final-form';
import {required} from '../../../../utils/validation';
import {FORM_REQUEST_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {useMutation} from '@apollo/react-hooks';
import CloseIcon from '@material-ui/icons/Close';
import {withRouter, BrowserRouterProps} from 'react-router-dom';

const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001px;

    @media only screen and (max-width: 500px) {
        width: 90%;
    }
`;

const Modal = styled.div`
    padding: 30px;
    background-color: #fff;
    width: 450px;

    @media only screen and (max-width: 500px) {
        width: 100%;
    }
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

    .MuiButton-outlinedPrimary {
        color: #e84f1d;
        border: 1px solid #e84f1d;
    }
`;

export const RecaptchaContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px 0px;
`;

export const ModalTitle = styled.span`
    text-transform: capitalize;
    margin-top: 20px;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
`;

// @ts-ignore
export const CustomInput = styled(Input)`
    padding-bottom: 15px;

    .MuiOutlinedInput.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #e84f1d;
    }

    .MuiFormLabel-root {
        font-size: 15px;
        color: #000;
    }

    .MuiOutlinedInput-notchedOutline {
        border-color: #e84f1d;
    }

    .MuiInputBase-root {
        border-radius: 10px;
        padding: 0;
        border-color: #e84f1d;
    }

    .MuiFormControl-marginNormal {
        margin-top: 0;
        margin-bottom: 0;
    }

    .MuiOutlinedInput-input {
        padding: 8px 15px;
    }

    .MuiInputLabel-formControl {
        top: -25px;
    }

    legend {
        display: none;
    }

    .MuiInputLabel-outlined {
        transform: none;
    }

    .MuiInputLabel-outlined.MuiInputLabel-shrink {
        transform: none;
    }
`;

export const CustomButton = styled(Button)`
    width: 100%;
    padding: 5px 0;
`;

interface FlatModalProps extends BrowserRouterProps {
    close: any;
    flat: any;
    match: any;
}

const FlatSidebarModal = ({close, flat, match}: FlatModalProps) => {
    const [isVerify, setVerify] = useState(false);

    const [makeRequest] = useMutation(FORM_REQUEST_TRADE);

    const onSubmit = async (values) => {
        const flatUpdated = {
            sale: flat.sale,
            price: flat.price,
            flatId: flat.id,
            flatNumber: flat.flatNumber,
            section: flat.section,
            level: String(flat.level),
            apartmentComplexId: flat.apartmentComplex.id,
            apartmentComplex: flat.apartmentComplex.name,
            house: flat.house.name,
            houseId: flat.house.id
        };

        await makeRequest({
            variables: {
                flat: flatUpdated,
                userInfo: {...values, developerUuid: match.params.developerUuid}
            }
        });

        close(false);
    };

    const verifyCallback = () => {
        setVerify(true);
    };

    return (
        <ModalContainer>
            <Modal>
                <Typography>
                    <ModalTitle>оставить заявку</ModalTitle>
                </Typography>
                <Form
                    subscription={{invalid: true}}
                    onSubmit={onSubmit}
                    render={({handleSubmit, invalid}) => (
                        <form onSubmit={handleSubmit}>
                            <CustomInput>
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
                            </CustomInput>
                            <CustomInput>
                                <Field name="email" validate={required}>
                                    {({input, meta}) => (
                                        <div>
                                            <TextField
                                                label="Email"
                                                margin="normal"
                                                fullWidth={true}
                                                variant="outlined"
                                                {...input}
                                            />
                                            {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
                                        </div>
                                    )}
                                </Field>
                            </CustomInput>
                            <CustomInput>
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
                            </CustomInput>
                            <RecaptchaContainer>
                                <Recaptcha
                                    sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                                    render="explicit"
                                    verifyCallback={verifyCallback}
                                />
                            </RecaptchaContainer>
                            <ButtonsContainer>
                                <CloseIcon
                                    onClick={() => close(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        color: '#e84f1D'
                                    }}
                                />
                                <CustomButton
                                    type="submit"
                                    variant="outlined"
                                    color="primary"
                                    disabled={invalid || !isVerify}
                                >
                                    Отправить
                                </CustomButton>
                            </ButtonsContainer>
                        </form>
                    )}
                />
            </Modal>
        </ModalContainer>
    );
};

// @ts-ignore
export default withRouter(FlatSidebarModal);
