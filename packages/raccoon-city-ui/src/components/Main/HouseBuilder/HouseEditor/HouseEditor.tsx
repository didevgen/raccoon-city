import {useQuery} from '@apollo/react-hooks';
import {AppBar} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, {Fragment, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GET_GROUPED_FLATS, GetGroupedFlatsByEntranceQuery, GroupedFlats} from '../../../../graphql/queries/houseQuery';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {LevelRepresentation} from './LevelRepresentation/LevelRepresentation';

function renderTabs(flats: GroupedFlats[]) {
    return flats.map((entrance) => {
        return <Tab key={`section${entrance.entrance}`} label={`Секция ${entrance.entrance}`} />;
    });
}

function renderLevels(flats: GroupedFlats[], value: number) {
    return flats.map((entrance, i) => {
        return (
            <TabPanel value={value} key={`section${entrance.entrance}`} index={i}>
                <LevelRepresentation entrance={entrance} />
            </TabPanel>
        );
    });
}

export function HouseEditor() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const {houseUuid: uuid} = useParams();
    const {loading, error, data} = useQuery<GetGroupedFlatsByEntranceQuery>(GET_GROUPED_FLATS, {
        variables: {
            uuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading || error || !data || !data.getGroupedFlatsByEntrance) {
        return null;
    }

    const entrances = data.getGroupedFlatsByEntrance;
    return (
        <Fragment>
            <AppBar position="static" color="default">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    {renderTabs(entrances)}
                </Tabs>
            </AppBar>
            {renderLevels(entrances, value)}
        </Fragment>
    );
}
