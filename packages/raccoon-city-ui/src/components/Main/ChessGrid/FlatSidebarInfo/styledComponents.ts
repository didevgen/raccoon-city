import styled from 'styled-components';
import {Button} from '@material-ui/core';

export const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    right: 3.5%;
    transform: translateY(-50%);
    z-index: 1001;
    box-shadow: 2px 2px 10px rgba(1, 1, 1, 0.5);

    @media only screen and (max-width: 500px) {
        width: 90%;
    }
`;

export const Modal = styled.div`
    padding: 30px;
    background-color: #fff;
    max-width: 320px;

    display: flex;
    flex-direction: column;
`;

export const Input = styled.div`
    margin: 30px 0px;
`;

export const InputError = styled.div`
    margin-bottom: -10px;
    padding-top: 5px;
    font-size: 12px;
    color: #e84f1d;
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
    display: none;
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

    .MuiInputBase-root {
        height: 35px;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #e84f1d;
    }

    .MuiOutlinedInput.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #e84f1d;
    }

    .MuiFormLabel-root {
        font-size: 15px;
        color: #000;
    }
    .MuiFormLabel-root.Mui-focused {
        color: #e84f1d;
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

    &.MuiButton-root:hover {
        background: #e84f1d;
        color: #fff;
    }
`;
export const TextWrapper = styled.div`
    text-align: center;
    font-weight: 600;
    margin: 10px;
`;

export const MainColorPainter = styled.span`
    color: #e84f1d;
`;
