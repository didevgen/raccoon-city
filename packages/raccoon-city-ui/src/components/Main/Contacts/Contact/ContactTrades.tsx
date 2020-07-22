import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

interface Props {
    trades: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular
        }
    })
);

const ContactTrades: React.FC<Props> = ({trades}) => {
    const classes = useStyles();

    if (!trades) {
        return <div>Loading</div>;
    }

    return (
        <div className={classes.root}>
            {trades.map((item) => (
                <Accordion key={item.id}>
                    <AccordionSummary aria-controls="panel1a-content" id={item.id}>
                        <span>
                            {`№: ${item.tradeNumber} Cтатус: ${item.leadStatus} Квартира: ${item.flat.flatNumber}`}
                        </span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            state
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.state}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            budget
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.budget}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            leadStatus
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.leadStatus}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            clientInterests
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.clientInterests}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            link
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.link}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            visitDate
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.visitDate}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            nextVisitDate
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.nextVisitDate}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            paymentType
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.paymentType}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            tradeSource
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.tradeSource}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            paymentProvider
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.paymentProvider}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            price
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.price}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            propertyType
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.propertyType}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={item.key}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="p">
                                            flatNumber
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" component="p">
                                            {item.flat.flatNumber}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default ContactTrades;
