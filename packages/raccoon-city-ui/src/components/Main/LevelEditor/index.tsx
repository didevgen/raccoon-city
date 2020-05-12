import {MutationTuple, useMutation, useQuery} from '@apollo/react-hooks';
import {Fab, IconButton, TableBody} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import React, {Fragment} from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {CREATE_LEVEL_LAYOUT, DELETE_LEVEL_LAYOUT, EDIT_LEVEL_LAYOUT} from '../../../graphql/mutations/layoutMutation';
import {GET_LEVEL_LAYOUTS} from '../../../graphql/queries/layoutQuery';
import {Confirmation} from '../../shared/components/dialogs/ConfirmDialog';
import {LevelLayout} from '../../shared/types/layout.types';
import {LayoutDialog} from '../Images/LayoutDialog/LayoutDialog';
import {LevelEditorDialog} from './LevelEditorDialog/LevelEditorDialog';
import {LevelLayoutSelectionDialog} from './LevelLayoutSelectionDialog/LevelLayoutSelectionDialog';
import {GET_LEVEL_LAYOUT_FLAT_LAYOUTS} from '../../../graphql/queries/levelQuery';

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

function EditLayoutButton({layout}) {
    const {houseUuid} = useParams();
    const [open, setOpen] = React.useState(false);
    const mutation = useMutation(EDIT_LEVEL_LAYOUT, {
        refetchQueries: [
            {
                query: GET_LEVEL_LAYOUTS,
                variables: {
                    houseId: houseUuid
                }
            },
            {
                query: GET_LEVEL_LAYOUT_FLAT_LAYOUTS,
                variables: {
                    levelLayoutId: layout.id
                }
            }
        ]
    });

    return (
        <Fragment>
            <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <CreateIcon fontSize="small" />
            </IconButton>
            <LayoutDialog
                isEdit={true}
                mutation={mutation}
                downloadLink={layout.image.previewImageUrl}
                setOpen={setOpen}
                open={open}
                params={{uuid: layout.id, name: layout.name}}
            />
        </Fragment>
    );
}

function LevelLayouts() {
    const {houseUuid} = useParams();
    const {loading, error, data, refetch} = useQuery(GET_LEVEL_LAYOUTS, {
        variables: {
            houseId: houseUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    const [deleteMutation] = useMutation(DELETE_LEVEL_LAYOUT, {
        refetchQueries: [
            {
                query: GET_LEVEL_LAYOUTS,
                variables: {
                    houseId: houseUuid
                }
            }
        ]
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
                        <TableCell />
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
                                <TableCell>
                                    <EditLayoutButton layout={layout} />
                                    <Confirmation>
                                        {(confirmFn: (cb: () => void) => void) => {
                                            return (
                                                <IconButton
                                                    aria-label="delete"
                                                    color="secondary"
                                                    onClick={() => {
                                                        confirmFn(() => async () => {
                                                            await deleteMutation({
                                                                variables: {
                                                                    uuid: layout.id
                                                                }
                                                            });
                                                        });
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            );
                                        }}
                                    </Confirmation>
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
    const mutation = useMutation(CREATE_LEVEL_LAYOUT, {
        refetchQueries: [
            {
                query: GET_LEVEL_LAYOUTS,
                variables: {
                    houseId: uuid
                }
            }
        ]
    });

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
