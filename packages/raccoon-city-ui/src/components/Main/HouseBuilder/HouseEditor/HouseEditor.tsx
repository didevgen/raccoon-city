import {useQuery} from '@apollo/react-hooks';
import {AppBar} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, {Fragment, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GET_GROUPED_FLATS, GroupedFlats} from '../../../../graphql/queries/houseQuery';
import {TabPanel} from '../../../shared/components/tabs/TabPanel';
import {LevelRepresentation} from './LevelRepresentation/LevelRepresentation';
import AddSectionButton from './LevelRepresentation/AddSectionButton';

function renderTabs(flats: GroupedFlats[]) {
    return flats.map((section) => {
        return <Tab key={section.id} label={`Секция ${section.section}`} />;
    });
}

function renderLevels(flats: GroupedFlats[], value: number) {
    return flats.map((section, i) => {
        return (
            <TabPanel value={value} key={section.id} index={i}>
                <LevelRepresentation section={section} />
            </TabPanel>
        );
    });
}

export function HouseEditor() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const {houseUuid} = useParams();

    const {loading, error, data} = useQuery(GET_GROUPED_FLATS, {
        variables: {
            uuid: houseUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading || error || !data?.getGroupedHouseData?.groupedFlats) {
        return null;
    }

    const sections = data.getGroupedHouseData.groupedFlats;
    return (
        <Fragment>
            <AppBar position="static" color="default">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable">
                    {renderTabs(sections)}
                </Tabs>
            </AppBar>
            <AddSectionButton houseId={houseUuid} />
            {renderLevels(sections, value)}
        </Fragment>
    );
}
