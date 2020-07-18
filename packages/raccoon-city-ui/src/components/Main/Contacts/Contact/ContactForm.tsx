import {useMutation, useQuery} from '@apollo/react-hooks';
import Select from '@appgeist/react-select-material-ui';
import {Button, Grid, IconButton, ListItem, Paper, Tab, Tabs, TextField} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/Cancel';
import SettingsIcon from '@material-ui/icons/Settings';
import arrayMutators from 'final-form-arrays';
import MuiPhoneNumber from 'material-ui-phone-number';
import React from 'react';
import {Field, Form} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {isRequired} from '../../../../core/validators/validators';
import {CREATE_CONTACT, UPDATE_CONTACT} from '../../../../graphql/mutations/contactMutation';
import {ALL_CONTACTS, GET_CONTACT_DROPDOWNS} from '../../../../graphql/queries/contactQuery';
import {GET_USERS} from '../../../../graphql/queries/userQuery';
import EditableTextField from '../../../shared/components/inputs/EditableTextField';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {KeyDisplayNameOptions, SingleDisplayName} from '../../Trades/Trade/components';

const ContactFormWrapper = styled.div`
    width: 40%;
    background-color: #fff;
    border-right: 3px solid #dbdbdb;
`;

const TitleArea = styled.div`
    height: 30%;
    max-height: 240px;
    background-color: #37485c;
    color: #fff;
    display: flex;
    flex-direction: column;
`;

const TabContainer = styled(Paper)`
    box-shadow: none;
    background-color: #37485c !important;
    .MuiButtonBase--root {
        color: #fff !important;
    }
    .MuiTab-textColorPrimary {
        color: #fff !important;
    }
    .MuiTabs-indicator {
        background-color: #fff !important;
    }
    margin-top: auto;
`;

const OptionsArea = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TitleWrapper = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

    .MuiInputBase-input,
    .EditIcon {
        font-size: 24px;
        line-height: 24px;
        color: #fff;
    }
`;

const OptionIcon: any = styled(IconButton)`
    &.MuiIconButton-root {
        color: white !important;
    }
`;

const ButtonWrapper = styled.div`
    padding: 16px;
`;
const StyledList = styled(List)`
    display: flex;
    padding: 8px !important;
    align-items: center;
    margin-left: 8px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        cursor: pointer;
    }
`;

function SingleValue({data}: any) {
    return data.name;
}

function CustomOption(props: any) {
    const {innerProps, data, innerRef} = props;
    return (
        <StyledList
            ref={innerRef}
            {...innerProps}
            onClick={() => {
                props.selectOption(data);
            }}
        >
            <ListItem alignItems="flex-start">
                <ListItemText primary={data.name} />
                <ListItemText primary={data?.role?.displayName} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </StyledList>
    );
}

export function ContactForm({onClose, contact}) {
    const {developerUuid} = useParams();
    const [value, setValue] = React.useState(0);
    const {data, loading, error} = useQuery(GET_USERS);
    const {data: dropdowns, loading: dropdownsLoading} = useQuery(GET_CONTACT_DROPDOWNS);

    const [mutation] = useMutation(contact ? UPDATE_CONTACT : CREATE_CONTACT);
    if (loading || error || dropdownsLoading) {
        return null;
    }
    const initialValues = contact
        ? {
              ...contact,
              clientStatus: dropdowns.clientStatuses.find(({key}) => key === contact.clientStatus)
          }
        : {
              phones: ['']
          };

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Form
            initialValues={initialValues}
            mutators={{
                ...arrayMutators
            }}
            subscription={{invalid: true, values: true}}
            onSubmit={() => {
                // silence
            }}
        >
            {({values, invalid}) => {
                return (
                    <ContactFormWrapper>
                        <TitleArea>
                            <OptionsArea>
                                <OptionIcon
                                    aria-label="upload picture"
                                    component="span"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    <ArrowBackIcon />
                                </OptionIcon>
                                <OptionIcon aria-label="upload picture" component="span">
                                    <SettingsIcon />
                                </OptionIcon>
                            </OptionsArea>
                            <TitleWrapper>
                                <Field name="name" validate={isRequired} defaultValue="Имя Фамилия">
                                    {(props) => {
                                        return <EditableTextField inputProps={props.input} />;
                                    }}
                                </Field>
                            </TitleWrapper>
                            <TabContainer>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Основное" />
                                    <Tab label="Сделки" />
                                </Tabs>
                            </TabContainer>
                        </TitleArea>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Field name="responsible" validate={isRequired}>
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Ответственный *"
                                                options={data.getUsers}
                                                value={props.input.value}
                                                onChange={(selectedValue: any) => {
                                                    props.input.onChange(selectedValue);
                                                }}
                                                isClearable={true}
                                                components={{
                                                    Option: CustomOption,
                                                    SingleValue
                                                }}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <FieldArray name="phones">
                                        {({fields}) =>
                                            fields.map((name, index) => (
                                                <Grid
                                                    container={true}
                                                    key={name}
                                                    spacing={3}
                                                    justify="center"
                                                    alignItems="center"
                                                    alignContent="center"
                                                >
                                                    <Grid item={true} xs={9}>
                                                        <Field name={name} validate={isRequired}>
                                                            {(props) => (
                                                                <MuiPhoneNumber
                                                                    name={props.input.name}
                                                                    value={props.input.value}
                                                                    onChange={props.input.onChange}
                                                                    fullWidth
                                                                    preferredCountries={['ua']}
                                                                    regions={'europe'}
                                                                    defaultCountry="ua"
                                                                    label={`Раб телефон (${index + 1}) *`}
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <IconButton
                                                            onClick={() => {
                                                                fields.push(undefined);
                                                            }}
                                                            color="primary"
                                                            aria-label="upload picture"
                                                            component="span"
                                                        >
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                        {index > 0 && (
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => {
                                                                    fields.remove(index);
                                                                }}
                                                                aria-label="upload picture"
                                                                component="span"
                                                            >
                                                                <CancelIcon />
                                                            </IconButton>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            ))
                                        }
                                    </FieldArray>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="clientStatus">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Статус клиента"
                                                options={dropdowns.clientStatuses}
                                                value={props.input.value}
                                                onChange={(selectedValue: any) => {
                                                    props.input.onChange(selectedValue);
                                                }}
                                                isClearable={true}
                                                components={{
                                                    Option: KeyDisplayNameOptions,
                                                    SingleValue: SingleDisplayName
                                                }}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="position">
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth
                                                    label="Должность"
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="email">
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth
                                                    label="Email"
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                    </Field>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            В разработке
                        </TabPanel>
                        <ButtonWrapper>
                            <Button onClick={onClose}>Отмена</Button>
                            <Button
                                disabled={invalid}
                                onClick={async () => {
                                    const variables: any = {
                                        contact: {
                                            ...values,
                                            clientStatus: values.clientStatus?.key,
                                            responsible: values.responsible.id
                                        }
                                    };

                                    if (contact) {
                                        variables.uuid = contact.id;
                                        delete variables.contact.__typename;
                                    } else {
                                        variables.developerUuid = developerUuid;
                                    }

                                    await mutation({
                                        variables,
                                        refetchQueries: [
                                            {
                                                query: ALL_CONTACTS,
                                                variables: {
                                                    developerUuid
                                                }
                                            }
                                        ]
                                    });
                                    onClose();
                                }}
                            >
                                Сохранить
                            </Button>
                        </ButtonWrapper>
                    </ContactFormWrapper>
                );
            }}
        </Form>
    );
}
