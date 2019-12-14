import Select from '@appgeist/react-select-material-ui';
import {createStyles, ListItem, makeStyles, Theme} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {houseDefaultImage} from '../../../../../core/constants';
import {House} from '../../../../shared/types/house.types';

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper
        },
        inline: {
            display: 'inline'
        }
    })
);

function CustomOption(props: {data: House} & any) {
    const classes = useStyles();
    const {innerProps, data, innerRef} = props;
    const imageUrl = data.images.CHESS_GRID ? data.images.CHESS_GRID.downloadUrl : houseDefaultImage;
    return (
        <StyledList
            className={classes.root}
            ref={innerRef}
            {...innerProps}
            onClick={() => {
                props.selectOption(data);
            }}
        >
            <ListItemAvatar>
                <Avatar alt={data.name} src={imageUrl} />
            </ListItemAvatar>
            <ListItem alignItems="flex-start">
                <ListItemText primary={data.name} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </StyledList>
    );
}

function SingleValue({data}: any) {
    return data.name;
}

interface HouseSelectProps {
    houses: House[];
}

export function HouseSelect(props: HouseSelectProps) {
    const [house, setHouse] = useState(null);

    // @ts-ignore
    return (
        <Select
            id="place"
            label="Выберете дом"
            options={props.houses}
            value={house}
            onChange={setHouse}
            isClearable={true}
            components={{
                Option: CustomOption,
                SingleValue
            }}
        />
    );
}
