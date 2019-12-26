import {useMutation} from '@apollo/react-hooks';
import {Button, ExpansionPanelSummary} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {Fragment, memo} from 'react';
import styled from 'styled-components';
import {ADD_LEVEL} from '../../../../../graphql/mutations/flatMutation';
import {GroupedFlats} from '../../../../../graphql/queries/houseQuery';
import {AddFlatCard} from '../AddFlatCard/AddFlatCard';
import {FlatCard} from '../FlatCard/FlatCard';
import {useParams} from 'react-router-dom';

interface LevelRepresentationProps {
    entrance: GroupedFlats;
}

const StyledButton = styled(Button)`
    margin-bottom: 16px !important;
`;

interface AddLevelButtonProps {
    entrance: string;
}
function AddLevelButton({entrance}: AddLevelButtonProps) {
    const [addLevel] = useMutation(ADD_LEVEL);
    const {houseUuid: uuid} = useParams();
    return (
        <StyledButton
            variant="contained"
            color="primary"
            onClick={async () => {
                await addLevel({
                    variables: {
                        uuid,
                        entrance
                    }
                });
            }}
        >
            Добавить этаж
        </StyledButton>
    );
}

export const LevelRepresentation = memo(function LevelRepresentationFn(props: LevelRepresentationProps) {
    const {entrance} = props;
    return (
        <Fragment>
            <AddLevelButton entrance={entrance.entrance} />
            {entrance.level.map((level) => {
                return (
                    <ExpansionPanel
                        key={`level${level.level}+${entrance.entrance}`}
                        TransitionProps={{unmountOnExit: true}}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Этаж {level.level}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container={true} spacing={3}>
                                <Grid container={true} spacing={3} item={true} xs={3}>
                                    <AddFlatCard level={level.level} entrance={props.entrance.entrance} />
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
                    </ExpansionPanel>
                );
            })}
        </Fragment>
    );
});
