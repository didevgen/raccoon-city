import {ExpansionPanelSummary} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {Fragment, memo} from 'react';
import {GroupedFlats} from '../../../../../graphql/queries/houseQuery';
import {FlatCard} from '../FlatCard/FlatCard';

interface LevelRepresentationProps {
    entrance: GroupedFlats;
}

export const LevelRepresentation = memo(function LevelRepresentationFn(props: LevelRepresentationProps) {
    const {entrance} = props;
    return (
        <Fragment>
            {entrance.level.map((level) => {
                return (
                    <ExpansionPanel key={`level${level.level}`}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Этаж {level.level}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container={true} spacing={3}>
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
