import {useQuery} from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import {ALL_APARTMENT_COMPLEXES} from '../../../graphql/queries/apartmentComplexQuery';
import {ApartmentComplexType} from '../../shared/types/apartmentComplex.types';
import {AddProperty} from './AddApartmentComplexList/AddProperty';
import {ApartmentComplex} from './ApartmentComplex/ApartmentComplex';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    })
);

export function ApartmentComplexList() {
    const classes = useStyles();
    const {loading, error, data} = useQuery<{getAllApartmentComplexes: ApartmentComplexType[]}>(
        ALL_APARTMENT_COMPLEXES
    );
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error :(</p>;
    }

    return (
        <div className={classes.root}>
            <Grid container={true} spacing={3} alignItems="center">
                <Grid item={true} xs={12} md={3}>
                    <AddProperty />
                </Grid>
                {data &&
                    data.getAllApartmentComplexes.map((complex: ApartmentComplexType) => {
                        return (
                            <Grid item={true} xs={12} md={3} key={complex.id}>
                                <ApartmentComplex name={complex.name} id={complex.id} />
                            </Grid>
                        );
                    })}
            </Grid>
        </div>
    );
}
