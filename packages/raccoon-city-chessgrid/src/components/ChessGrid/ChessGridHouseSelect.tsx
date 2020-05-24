import {useQuery} from '@apollo/react-hooks';
import Select from '@appgeist/react-select-material-ui';
import {createStyles, ListItem, Theme} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import * as React from 'react';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {components} from 'react-select';
import styled from 'styled-components';
import {GET_DEVELOPER_APARTMENT_COMPLEXES} from '../../core/graphql/queries/developerQuery';
import {houseDefaultImage} from '../../shared/constants';
import {House} from '../../shared/types/house.types';

const StyledHeading = styled.div`
    display: inline-flex;
    padding: 8px;
    align-items: center;
    border-bottom: 1px solid #ccc;
    width: 100%;
`;

const SelectTitle = styled.div`
    margin-left: 8px;
    font-size: 18px;
    font-weight: 700;
`;

const StyledList = styled(List)`
    display: flex;
    padding: 8px !important;
    align-items: center;
    padding-left: 32px !important;
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        cursor: pointer;
    }
`;

const SelectContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 16px;
    .HouseSelect {
        width: 100%;
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        large: {
            width: theme.spacing(8),
            height: theme.spacing(8)
        },
        xlarge: {
            width: theme.spacing(10),
            height: theme.spacing(10)
        },
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper
        }
    })
);

function GroupHeading(props) {
    const imageUrl = props.apartmentComplexImage ? props.apartmentComplexImage.downloadUrl : houseDefaultImage;
    return (
        <StyledHeading>
            <Avatar alt={'name'} src={imageUrl} />
            <SelectTitle>{props.children}</SelectTitle>
        </StyledHeading>
    );
}

const Group = (props) => {
    return (
        <components.Group
            {...props}
            headingProps={{apartmentComplexImage: props.data.apartmentComplexImage, ...props.headingProps}}
        />
    );
};

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
                <Avatar alt={data.name} src={imageUrl} className={classes.large} />
            </ListItemAvatar>
            <ListItem alignItems="flex-start">
                <ListItemText primary={data.name} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </StyledList>
    );
}
interface ChessGridHouseSelectProps {
    onChange: (house: House[]) => void;
}
export function ChessGridHouseSelect({onChange}: ChessGridHouseSelectProps) {
    const {developerUuid} = useParams();
    const [houses, setHouses] = useState<House[]>([]);

    const {data, loading, error} = useQuery(GET_DEVELOPER_APARTMENT_COMPLEXES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: developerUuid
        }
    });

    if (loading || error) {
        return null;
    }

    const options = data.getApartmentComplexesByDeveloper.map((apartmentComplex) => {
        return {
            label: apartmentComplex.name,
            apartmentComplexImage: apartmentComplex.images.CHESS_GRID,
            options: apartmentComplex.houses.map((house) => {
                return {
                    label: house.name,
                    ...house
                };
            })
        };
    });

    return (
        <Select
            id="place"
            label="Выберите дом"
            options={options}
            className="HouseSelect"
            value={houses}
            isMulti
            getOptionValue={(value) => {
                return value.id;
            }}
            onChange={(selectedValues: [House]) => {
                setHouses(selectedValues);
                onChange(selectedValues);
            }}
            isClearable={true}
            components={{
                GroupHeading,
                Option: CustomOption,
                Group
            }}
        />
    );
}
