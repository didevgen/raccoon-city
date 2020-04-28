import {TextField} from '@material-ui/core';
import React, {Fragment} from 'react';
import {Field} from 'react-final-form';
import styled from 'styled-components';

interface Props {
    fieldName: string;
    id: string;
    label: string;
    type: string;
    variant: string;
}

const Input = styled.div`
    display: flex;
    margin-bottom: 20px;
    width: 60%;
    flex-direction: column;
`;

const InputError = styled.div`
    font-size: 12px;
    color: #d73c2a;
    text-align: center;
    margin-top: 8px;
`;

const InputValidate: React.FC<Props> = ({fieldName, id, label, type}) => {
    return (
        <Input>
            <Field name={fieldName}>
                {({input, meta}) => (
                    <Fragment>
                        <TextField fullWidth variant="outlined" id={id} label={label} type={type} {...input} />
                        {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
                    </Fragment>
                )}
            </Field>
        </Input>
    );
};

export default InputValidate;
