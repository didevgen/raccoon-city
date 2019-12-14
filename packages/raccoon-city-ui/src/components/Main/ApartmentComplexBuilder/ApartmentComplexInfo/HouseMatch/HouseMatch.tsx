import {useQuery} from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as React from 'react';
import styled from 'styled-components';
import {HOUSE_LIST} from '../../../../../graphql/queries/houseQuery';
import {ParsedFlat} from '../../../../shared/types/flat.types';
import {House} from '../../../../shared/types/house.types';
import {HouseSelect} from './HouseSelect';

interface ParsedHouse {
    house: string;
    flats: ParsedFlat[];
}

interface HouseMatchProps {
    data: ParsedHouse[];
    apartmentComplexUuid: string;
}

interface HouseMatchRowProps {
    houseToMatch: string;
    houses: House[];
}

const StyledCell = styled(TableCell)`
    width: 50%;
`;

function HouseMatchRow(props: HouseMatchRowProps) {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {props.houseToMatch}
            </TableCell>
            <StyledCell align="right">
                <HouseSelect houses={props.houses} />
            </StyledCell>
        </TableRow>
    );
}

export function HouseMatch(props: HouseMatchProps) {
    const {loading, error, data} = useQuery<{getHouses: House[]}>(HOUSE_LIST, {
        variables: {
            apartmentComplexId: props.apartmentComplexUuid
        }
    });

    if (error || loading || !data) {
        return null;
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
                                houseToMatch={parsedDataItem.house}
                                houses={houses}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}
