import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
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
`;
const styles = (theme) => ({
    disabled: {
        borderBottom: 0,
        '&:before': {
            borderBottom: 0
        }
    }
});

class EditableTextField extends React.Component<any, any> {
    public state = {
        editMode: false
    };

    public handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    public handleClick = () => {
        this.setState({
            editMode: true,
            mouseOver: false
        });
    };

    public render() {
        const {classes, value} = this.props;

        return (
            <FieldWrapper>
                {this.props.label && <Label>{this.props.label}</Label>}
                <StyledTextField
                    name="email"
                    defaultValue={value}
                    margin="normal"
                    fullWidth
                    onChange={this.handleChange}
                    disabled={!this.state.editMode}
                    onBlur={() => {
                        this.setState(() => ({
                            editMode: false
                        }));
                    }}
                    InputProps={{
                        classes: {
                            disabled: classes.disabled
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={this.handleClick}>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </FieldWrapper>
        );
    }
}

export default withStyles(styles as any)(EditableTextField);
