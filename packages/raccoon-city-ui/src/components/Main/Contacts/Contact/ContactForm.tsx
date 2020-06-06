import {IconButton, Paper, Tab, Tabs} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import styled from 'styled-components';
import EditableTextField from '../../../shared/components/inputs/EditableTextField';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';

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
    font-size: 24px;
    line-height: 24px;
`;

const OptionIcon: any = styled(IconButton)`
    &.MuiIconButton-root {
        color: white !important;
    }
`;

export function ContactForm({onClose}) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
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
                <TitleWrapper>Имя Фамилия</TitleWrapper>
                <TabContainer>
                    <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
                        <Tab label="Основное" />
                        <Tab label="Сделки" />
                    </Tabs>
                </TabContainer>
            </TitleArea>
            <TabPanel value={value} index={0}>
                <EditableTextField label="Раб телефон" value="" />
                <EditableTextField label="Email" value="janeDoe@domain.com" />
                <EditableTextField label="Должность" value="Мастер" />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
        </ContactFormWrapper>
    );
}
