import {useMutation, useQuery} from '@apollo/react-hooks';
import Select from '@appgeist/react-select-material-ui';
import {Button, Grid, IconButton, ListItem, Paper, Tab, Tabs, TextField} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import {KeyboardDatePicker} from '@material-ui/pickers';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import {Field, Form} from 'react-final-form';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {isRequired} from '../../../../core/validators/validators';
import {CREATE_TRADE, UPDATE_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {ALL_TRADES, GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {GET_USERS} from '../../../../graphql/queries/userQuery';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {KeyDisplayNameOptions, SingleDisplayName, TradeStateOptions} from './components';
import {ContactTab} from './ContactTab';
import {FlatSelection} from './FlatSelection';

const ContactFormWrapper = styled.div`
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
    padding: 24px;
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

const TradeTypeSelect = styled(Select)`
    .MuiFormLabel-root {
        color: white;
    }
    .MuiFormLabel-root.Mui-focused {
        color: white;
    }

    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: inherit;
    }
`;

const TradeTitle = styled.div`
    display: flex;
    font-size: 24px;
    line-height: 24px;
    justify-content: center;
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

export function TradeForm({onClose, trade}) {
    const {developerUuid} = useParams();
    const [value, setValue] = React.useState(0);
    const {data, loading, error} = useQuery(GET_USERS);
    const {data: dropdowns, loading: dropdownsLoading} = useQuery(GET_TRADE_DROPDOWNS);
    const [mutation] = useMutation(trade ? UPDATE_TRADE : CREATE_TRADE);

    if (loading || error || dropdownsLoading) {
        return null;
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const initialTrade = trade
        ? {
              ...trade,
              existingContact: trade.contact,
              flat: {
                  ...trade.flat,
                  apartmentComplex: {
                      name: trade.flat.apartmentComplex,
                      id: trade.flat.apartmentComplexId
                  },
                  house: {
                      name: trade.flat.house,
                      id: trade.flat.houseId
                  }
              },
              contactType: 'existing',
              state: dropdowns.tradeStates.find(({key}) => key === trade.state),
              tradeSource: dropdowns.tradeSources.find(({key}) => key === trade.tradeSource),
              leadStatus: dropdowns.leadStatuses.find(({key}) => key === trade.leadStatus),
              // filter
              clientInterests: dropdowns.clientInterests.find(({key}) => trade.clientInterests.includes(key)),
              propertyType: dropdowns.propertyTypes.find(({key}) => key === trade.propertyType),
              paymentType: dropdowns.paymentTypes.find(({key}) => key === trade.paymentType),
              paymentProvider: dropdowns.paymentProviders.find(({key}) => key === trade.paymentProvider)
          }
        : {
              existingContact: {
                  phones: ['']
              },
              newContact: {
                  phones: ['']
              }
          };
    return (
        <Form
            subscription={{invalid: true}}
            initialValues={initialTrade}
            mutators={{
                ...arrayMutators
            }}
            initialValuesEqual={(a, b) => {
                return true;
            }}
            onSubmit={() => {
                // silence
            }}
        >
            {({invalid, form}) => {
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
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TradeTitle>
                                            {trade ? `Сделка №${initialTrade.tradeNumber}` : 'Новая сделка'}
                                        </TradeTitle>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field name="state" validate={isRequired}>
                                            {(props) => (
                                                <TradeTypeSelect
                                                    id="place"
                                                    label="Статус сделки"
                                                    options={dropdowns.tradeStates}
                                                    value={props.input.value}
                                                    onChange={(selectedValue: any) => {
                                                        props.input.onChange(selectedValue);
                                                    }}
                                                    isClearable={true}
                                                    components={{
                                                        Option: TradeStateOptions,
                                                        SingleValue: SingleDisplayName
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                </Grid>
                            </TitleWrapper>
                            <TabContainer>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Информация о сделке" />
                                    <Tab label="Контакт" />
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
                                                label="Ответственный"
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
                                    <Field name="budget">
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="Бюджет"
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="tradeSource">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Источник заявки"
                                                options={dropdowns.tradeSources}
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
                                    <Field name="leadStatus">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Статус лида"
                                                options={dropdowns.leadStatuses}
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
                                    <Field name="clientInterests" validate={isRequired}>
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Что интересует"
                                                options={dropdowns.clientInterests}
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
                                    <Field name="link">
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="Ссылка"
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                    </Field>
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <Field name="visitDate">
                                        {(props) => (
                                            <KeyboardDatePicker
                                                name={props.input.name}
                                                inputVariant="outlined"
                                                placeholder="день.месяц.год"
                                                fullWidth
                                                label="Дата визита"
                                                value={props.input.value ? props.input.value : null}
                                                onChange={props.input.onChange}
                                                format="dd.MM.yyyy"
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="propertyType">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Тип объекта"
                                                options={dropdowns.propertyTypes}
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
                                    <FlatSelection />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="paymentType">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Тип оплаты"
                                                options={dropdowns.paymentTypes}
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
                                    <Field name="paymentProvider">
                                        {(props) => (
                                            <Select
                                                id="place"
                                                label="Через кого оплата"
                                                options={dropdowns.paymentProviders}
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
                                    <Field name="price">
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="Цена за м2"
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                    </Field>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ContactTab />
                        </TabPanel>
                        <ButtonWrapper>
                            <Button onClick={onClose}>Отмена</Button>
                            <Button
                                disabled={invalid}
                                onClick={async () => {
                                    const values = form.getState().values;
                                    const flat = {
                                        flatId: values.flat.id,
                                        flatNumber: String(values.flat.flatNumber),
                                        section: values.flat.section,
                                        level: String(values.flat.level),
                                        houseId: values.flat.house.id,
                                        house: values.flat.house.name,
                                        apartmentComplexId: values.flat.apartmentComplex.id,
                                        apartmentComplex: values.flat.apartmentComplex.name
                                    };

                                    const variables: any = {
                                        trade: {
                                            state: values.state?.key,
                                            budget: Number(values.budget),
                                            leadStatus: values.leadStatus?.key,
                                            clientInterests: [values.clientInterests?.key],
                                            link: values.link,
                                            visitDate: values.visitDate,
                                            paymentType: values.paymentType?.key,
                                            tradeSource: values.tradeSource?.key,
                                            propertyType: values.propertyType?.key,
                                            paymentProvider: values.paymentProvider?.key,
                                            price: Number(values.price),
                                            flat,
                                            responsible: values.responsible.id
                                        }
                                    };

                                    if (values.contactType === 'new') {
                                        variables.trade.newContact = values.newContact;
                                    } else {
                                        variables.trade.existingContact = values.existingContact.id;
                                    }

                                    if (trade) {
                                        variables.uuid = trade.id;
                                    } else {
                                        variables.developerUuid = developerUuid;
                                    }

                                    await mutation({
                                        variables,
                                        refetchQueries: [
                                            {
                                                query: ALL_TRADES,
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
