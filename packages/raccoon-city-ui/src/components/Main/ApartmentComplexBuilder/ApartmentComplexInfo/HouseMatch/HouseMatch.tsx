import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import omit from 'ramda/src/omit';
import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {HOUSE_LIST} from '../../../../../graphql/queries/houseQuery';
import {Flat, ParsedFlat} from '../../../../shared/types/flat.types';
import {House} from '../../../../shared/types/house.types';
import {HouseSelect} from './HouseSelect';
import {ASSIGN_FLATS} from '../../../../../graphql/mutations/apartmentComplexMutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Redirect} from 'react-router';
import {useParams} from 'react-router-dom';

interface ParsedHouse {
    house: string;
    flats: ParsedFlat[];
}

interface HouseMatchProps {
    data: ParsedHouse[];
    apartmentComplexUuid: string;
    onCancel: () => void;
}

interface HouseMatchRowProps {
    houseToMatch: ParsedHouse;
    houses: House[];
    onCombine: (house: House) => void;
}

const ButtonContainer = styled.div`
    display: flex;
    padding: 16px;
    align-items: center;
    justify-content: flex-end;
`;

const StyledCell = styled(TableCell)`
    width: 50%;
`;

function HouseMatchRow(props: HouseMatchRowProps) {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {props.houseToMatch.house}
            </TableCell>
            <StyledCell align="right">
                <HouseSelect houses={props.houses} onSelect={props.onCombine} />
            </StyledCell>
        </TableRow>
    );
}

interface HouseMapInterface {
    [key: string]: {
        selectedHouse: House;
        flats: Flat[];
    };
}

function mapState(data: HouseMapInterface) {
    return Object.keys(data).map((key) => {
        const {selectedHouse, flats} = data[key];
        return {
            houseId: selectedHouse.id,
            flats: flats.map((flat) => {
                return omit(['__typename'], flat);
            })
        };
    });
}

export function HouseMatch(props: HouseMatchProps) {
    const [matchMap, setValue] = useState<any>({});
    const {uuid} = useParams();
    const {loading, error, data} = useQuery<{getHouses: House[]}>(HOUSE_LIST, {
        variables: {
            apartmentComplexId: props.apartmentComplexUuid
        }
    });

    const [assignFlats, {loading: loadingImport, data: result, error: importError}] = useMutation(ASSIGN_FLATS);

    if (error || loading || !data) {
        return null;
    }

    if (result) {
        return <Redirect to={`/apartmentComplex/${uuid}/overview/houses`} />;
    }

    const houses = data.getHouses;
    return (
        <Paper>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Дома в файле</TableCell>
                        <TableCell align="right">Дома в системе</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((parsedDataItem: ParsedHouse) => {
                        return (
                            <HouseMatchRow
                                key={parsedDataItem.house}
                                houseToMatch={parsedDataItem}
                                houses={houses}
                                onCombine={(selectedHouse: House) => {
                                    const prevStateCopy = {...matchMap};

                                    if (selectedHouse === null) {
                                        delete prevStateCopy[parsedDataItem.house];
                                    } else {
                                        prevStateCopy[parsedDataItem.house] = {
                                            selectedHouse,
                                            flats: parsedDataItem.flats
                                        };
                                    }
                                    setValue(prevStateCopy);
                                }}
                            />
                        );
                    })}
                </TableBody>
            </Table>
            <ButtonContainer>
                <Button variant="contained" onClick={props.onCancel}>
                    Отмена
                </Button>
                <Button
                    disabled={loadingImport}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await assignFlats({
                            variables: {
                                data: mapState(matchMap)
                            }
                        });
                    }}
                >
                    {loadingImport && <CircularProgress size={30} thickness={5} />}
                    Импорт
                </Button>
            </ButtonContainer>
        </Paper>
    );
}
