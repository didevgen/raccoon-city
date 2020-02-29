import {MutationTuple, useMutation, useQuery} from '@apollo/react-hooks';
import {Fab, TableBody} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {CREATE_LEVEL_LAYOUT} from '../../../graphql/mutations/layoutMutation';
import {GET_LEVEL_LAYOUTS} from '../../../graphql/queries/layoutQuery';
import {LevelLayout} from '../../shared/types/layout.types';
import {LayoutDialog} from '../Images/LayoutDialog/LayoutDialog';
import {LevelEditorDialog} from './LevelEditorDialog/LevelEditorDialog';
import {LevelLayoutSelectionDialog} from './LevelLayoutSelectionDialog/LevelLayoutSelectionDialog';

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledFab = styled(Fab)`
    &.MuiFab-root {
        width: 140px;
        height: 140px;
        .MuiSvgIcon-root {
            width: 3em;
            height: 3em;
        }
    }
`;

interface NewLayoutProps {
    uuid: string;
    mutation: MutationTuple<any, any>;
}

function CreateLayout({uuid, mutation}: NewLayoutProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <ButtonContainer>
            <StyledFab
                color="secondary"
                aria-label="add"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <AddIcon />
            </StyledFab>
            <LayoutDialog mutation={mutation} setOpen={setOpen} open={open} params={{uuid}} />
        </ButtonContainer>
    );
}

const LayoutImage = styled.img`
    max-height: 120px;
`;

function LevelLayouts() {
    const {houseUuid} = useParams();
    const {loading, error, data, refetch} = useQuery(GET_LEVEL_LAYOUTS, {
        variables: {
            houseId: houseUuid
        }
    });

    if (loading || error) {
        return null;
    }

    return (
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Планировка</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Этажи</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.getLevelLayouts.map((layout: LevelLayout) => {
                        return (
                            <TableRow hover tabIndex={-1} key={layout.id}>
                                <TableCell>
                                    <LayoutImage src={layout.image.previewImageUrl} />
                                </TableCell>
                                <TableCell>{layout.name}</TableCell>
                                <TableCell>
                                    <LevelEditorDialog refetch={refetch} layoutId={layout.id} />
                                    <LevelLayoutSelectionDialog layout={layout} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function LevelLayoutEditor() {
    const {houseUuid: uuid} = useParams();
    const mutation = useMutation(CREATE_LEVEL_LAYOUT);

    if (!uuid) {
        return null;
    }

    return (
        <div>
            <CreateLayout mutation={mutation} uuid={uuid} />
            <LevelLayouts />
        </div>
    );
}
