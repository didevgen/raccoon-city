import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import React, {useRef, useState} from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
    display: flex;
    align-items: center;
`;
const StyledTextField = styled(TextField)`
    margin: 0 !important;
`;
const Label = styled.div`
    margin-right: 8px;
    white-space: nowrap;
`;
const styles = (theme) => ({
    disabled: {
        borderBottom: 0,
        '&:before': {
            borderBottom: 0
        }
    }
});

function EditableTextField({classes, value, label, inputProps, ...props}) {
    const [editMode, setEditMode] = useState(false);
    const ref: any = useRef();
    const handleChange = () => {};
    return (
        <FieldWrapper>
            {label && <Label>{label}</Label>}
            <StyledTextField
                inputRef={ref}
                name="email"
                margin="normal"
                fullWidth
                onChange={handleChange}
                disabled={!editMode}
                onBlur={() => {
                    setEditMode(false);
                }}
                InputProps={{
                    classes: {
                        disabled: classes.disabled
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                className="EditIcon"
                                onClick={() => {
                                    setEditMode(true);
                                    if (ref.current) {
                                        setTimeout(() => {
                                            ref.current.focus();
                                        });
                                    }
                                }}
                            >
                                <Edit />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                {...inputProps}
            />
        </FieldWrapper>
    );
}

export default withStyles(styles as any)(EditableTextField);
