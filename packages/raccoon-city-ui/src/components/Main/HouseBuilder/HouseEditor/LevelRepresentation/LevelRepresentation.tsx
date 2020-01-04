import {useMutation} from '@apollo/react-hooks';
import {Button, ExpansionPanelSummary, FormControlLabel} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {Fragment, memo} from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styled from 'styled-components';
import {ADD_LEVEL, DELETE_LEVEL} from '../../../../../graphql/mutations/flatMutation';
import {GET_SECTION} from '../../../../../graphql/queries/flatQuery';
import {GroupedFlats} from '../../../../../graphql/queries/houseQuery';
import {AddFlatCard} from '../AddFlatCard/AddFlatCard';
import {FlatCard} from '../FlatCard/FlatCard';

interface LevelRepresentationProps {
    section: GroupedFlats;
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
                        }
                    ]
                });
            }}
        >
            Добавить этаж
        </StyledButton>
    );
}

interface DeleteLevelButtonProps {
    levelId: string;
    sectionId: string;
}

function DeleteLevelButton(props: DeleteLevelButtonProps) {
    const [deleteLevel] = useMutation(DELETE_LEVEL);
    return (
        <StyledIconButton
            color="secondary"
            onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
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
                        }
                    ]
                });
            }}
        >
            <DeleteOutline />
        </StyledIconButton>
    );
}

const SortableItem = SortableElement(ExpansionPanel);
const SortableList = SortableContainer(({section}: LevelRepresentationProps) => {
    return (
        <div>
            {section.levels.map((level, i) => {
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
                                    <AddFlatCard level={level.level} section={section.section} />
                                </Grid>
                                {level.flats.map((flat) => {
                                    return (
                                        <Grid key={flat.id} container={true} item={true} xs={3} spacing={3}>
                                            <FlatCard flat={flat} />
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
    return (
        <Fragment>
            <AddLevelButton section={section.id} />
            <SortableList useDragHandle={true} section={section} />
        </Fragment>
    );
});
