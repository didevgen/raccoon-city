import {createStyles, makeStyles, TextField, Theme} from '@material-ui/core';
import React from 'react';
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
    width: 40%;
    margin-bottom: 20px;
`;

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiFormControl-root': {
            width: '140%'
        }
    }
}));

const InputError = styled.div`
    margin-bottom: -10px;
    padding-top: 5px;
    font-size: 12px;
    color: #d73c2a;
    text-align: center;
`;

const InputValidate: React.FC<Props> = ({fieldName, id, label, type}) => {
    const classes = useStyles();
    return (
        <Input className={classes.root}>
            <Field name={fieldName}>
                {({input, meta}) => (
                    <div>
                        <TextField variant="outlined" id={id} label={label} type={type} {...input} />
                        {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
                    </div>
                )}
            </Field>
        </Input>
    );
};

export default InputValidate;
