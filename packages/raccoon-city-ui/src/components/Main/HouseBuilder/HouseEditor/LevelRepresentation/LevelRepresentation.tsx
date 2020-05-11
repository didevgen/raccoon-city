import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button, ExpansionPanelSummary, FormControlLabel} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import arrayMove from 'array-move';
import React, {Fragment, memo, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styled from 'styled-components';
import {ADD_LEVEL, DELETE_LEVEL, DELETE_SECTION} from '../../../../../graphql/mutations/flatMutation';
import {REORDER_LEVELS} from '../../../../../graphql/mutations/houseMutation';
import {GET_MAX_LEVEL, GET_SECTION} from '../../../../../graphql/queries/flatQuery';
import {GET_GROUPED_FLATS, GroupedFlats} from '../../../../../graphql/queries/houseQuery';
import {Confirmation} from '../../../../shared/components/dialogs/ConfirmDialog';
import {Flat} from '../../../../shared/types/flat.types';
import {AddFlatCard} from '../AddFlatCard/AddFlatCard';
import {FlatCard} from '../FlatCard/FlatCard';

interface LevelRepresentationProps {
    section: GroupedFlats;
}

interface SortableListRepresentation {
    section: GroupedFlats;
    levels: Array<{
        id: string;
        level: number;
        flats: Flat[];
    }>;
    maxLevel: number;
}

const StyledButton = styled(Button)`
    margin-bottom: 16px !important;
`;

const StyledIconButton = styled(IconButton)`
    margin-left: auto !important;
    margin-right: 0 !important;
`;

const StyledInfo = styled(Typography)`
    align-self: center;
`;

interface AddLevelButtonProps {
    section: string;
}

const DragHandle = SortableHandle(() => <DehazeIcon />);

function AddLevelButton({section}: AddLevelButtonProps) {
    const [addLevel] = useMutation(ADD_LEVEL);
    return (
        <StyledButton
            variant="contained"
            color="primary"
            onClick={async () => {
                await addLevel({
                    variables: {
                        sectionId: section
                    },
                    refetchQueries: [
                        {
                            query: GET_SECTION,
                            variables: {
                                sectionId: section
                            }
                        },
                        {
                            query: GET_MAX_LEVEL,
                            variables: {
                                sectionId: section
                            }
                        }
                    ]
                });
            }}
        >
            Добавить этаж
        </StyledButton>
    );
}

interface DeleteSectionButtonProps {
    houseId: string;
    sectionId: string;
}

function DeleteSectionButton({sectionId, houseId}: DeleteSectionButtonProps) {
    const [deleteSection] = useMutation(DELETE_SECTION);
    return (
        <Confirmation>
            {(confirmFn: (cb: () => void) => void) => {
                return (
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            confirmFn(() => async () => {
                                await deleteSection({
                                    variables: {
                                        sectionId
                                    },
                                    refetchQueries: [
                                        {
                                            query: GET_GROUPED_FLATS,
                                            variables: {
                                                uuid: houseId
                                            }
                                        }
                                    ]
                                });
                            });
                        }}
                    >
                        Удалить секцию
                    </StyledButton>
                );
            }}
        </Confirmation>
    );
}

interface DeleteLevelButtonProps {
    levelId: string;
    sectionId: string;
}

function DeleteLevelButton(props: DeleteLevelButtonProps) {
    const [deleteLevel] = useMutation(DELETE_LEVEL);
    return (
        <Confirmation>
            {(confirmFn: (cb: () => void) => void) => {
                return (
                    <StyledIconButton
                        color="secondary"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            confirmFn(() => async () => {
                                await deleteLevel({
                                    variables: {
                                        levelId: props.levelId
                                    },
                                    refetchQueries: [
                                        {
                                            query: GET_SECTION,
                                            variables: {
                                                sectionId: props.sectionId
                                            }
                                        },
                                        {
                                            query: GET_MAX_LEVEL,
                                            variables: {
                                                sectionId: props.sectionId
                                            }
                                        }
                                    ]
                                });
                            });
                        }}
                    >
                        <DeleteOutline />
                    </StyledIconButton>
                );
            }}
        </Confirmation>
    );
}

const SortableItem = SortableElement(ExpansionPanel);
const SortableList = SortableContainer(({section, levels, maxLevel}: SortableListRepresentation) => {
    return (
        <div>
            {levels.map((level, i) => {
                return (
                    <SortableItem key={level.id} index={i} TransitionProps={{unmountOnExit: true}}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <FormControlLabel label="" control={<DragHandle />} />
                            <StyledInfo>Этаж {level.level}</StyledInfo>
                            <DeleteLevelButton sectionId={section.id} levelId={level.id} />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container={true} spacing={3}>
                                <Grid container={true} spacing={3} item={true} xs={3}>
                                    <AddFlatCard
                                        level={level.level}
                                        sectionId={section.id}
                                        section={section.section}
                                        maxLevel={maxLevel}
                                    />
                                </Grid>
                                {level.flats.map((flat) => {
                                    return (
                                        <Grid key={flat.id} container={true} item={true} xs={3} spacing={3}>
                                            <FlatCard flat={flat} sectionId={section.id} maxLevel={maxLevel} />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </ExpansionPanelDetails>
                    </SortableItem>
                );
            })}
        </div>
    );
});

export const LevelRepresentation = memo(function LevelRepresentationFn(props: LevelRepresentationProps) {
    const {section} = props;

    const [levels, setLevels] = useState(props.section.levels);
    const [reorderFlats] = useMutation(REORDER_LEVELS);
    const {data, error, loading} = useQuery(GET_MAX_LEVEL, {
        variables: {
            sectionId: section.id
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        setLevels(props.section.levels);
    }, [props.section]);
    const {houseUuid} = useParams();

    if (error || loading) {
        return null;
    }

    const maxLevel = data.getMaxLevelInSection || 0;

    if (!houseUuid) {
        return null;
    }

    return (
        <Fragment>
            <DeleteSectionButton sectionId={section.id} houseId={houseUuid} />
            <AddLevelButton section={section.id} />
            <SortableList
                maxLevel={maxLevel}
                useDragHandle={true}
                section={section}
                levels={levels}
                onSortEnd={async ({oldIndex, newIndex, collection, isKeySorting}, e) => {
                    setLevels(
                        arrayMove(levels, oldIndex, newIndex).map((level, index) => {
                            return {
                                ...level,
                                level: levels.length - index
                            };
                        })
                    );
                    await reorderFlats({
                        variables: {
                            sectionId: section.id,
                            oldIndex,
                            newIndex
                        }
                    });
                }}
            />
        </Fragment>
    );
});
