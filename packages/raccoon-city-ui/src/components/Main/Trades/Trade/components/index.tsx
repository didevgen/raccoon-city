import {ListItem} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import styled from 'styled-components';

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

const StateMarker = styled.div`
    display: inline-block;
    min-width: 20px;
    height: 20px;
    align-self: center;
    margin-right: 8px;
`;

const DisplayNameWrapper = styled.div`
    display: inline-flex;
    align-items: center;
`;
export function SingleDisplayName({data}: any) {
    return data.displayName;
}

export function TradeDisplayName({data}: any) {
    return (
        <DisplayNameWrapper>
            <StateMarker
                style={{
                    backgroundColor: data.color || '#aaa'
                }}
            />
            <div>{data.displayName}</div>
        </DisplayNameWrapper>
    );
}
export function TradeStateOptions(props: any) {
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
                <StateMarker
                    style={{
                        backgroundColor: data.color || '#aaa'
                    }}
                />
                <ListItemText primary={data?.displayName} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </StyledList>
    );
}

export function KeyDisplayNameOptions(props: any) {
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
                <ListItemText primary={data?.displayName} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </StyledList>
    );
}
