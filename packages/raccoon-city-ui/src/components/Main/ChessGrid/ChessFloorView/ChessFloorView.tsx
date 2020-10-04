import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Select, MenuItem} from '@material-ui/core';
import {GET_PUBLISHED_FLATS_EXTENDED, GET_FLATS_LAYOUTS_EXTENDED} from '../../../../graphql/queries/layoutQuery';
import {getSections, getFlatsIds, getInfo} from './ChessFloorUtils';
import {
    FloorViewContainer,
    FloorsListContainer,
    FloorContentContainer,
    FloorsListItem,
    FloorLegendInfo,
    FloorLegendItem,
    FlatInfo
} from './ChessFloorView.styled';
import {LayoutView} from '../FlatSidebarInfo/LayoutView';

export const ChessFloorView = (props) => {
    const {onSelect, houseFlats, isPublic} = props;
    const {groupedFlats} = houseFlats[0];

    const [sections] = useState(getSections(groupedFlats));
    const [currentSection, setCurrentSection] = useState(Object.keys(sections)[0]);
    const [currentLevel, setCurrentLevel] = useState(sections[currentSection].levels[0].id);
    const [currentDataId, setCurrentDataId] = useState('');

    const publicVariables = {
        houseId: houseFlats[0].id,
        sectionId: currentSection,
        levelId: currentLevel
    };

    const variables = {
        levelId: currentLevel,
        houseId: houseFlats[0].id,
        flatsIds: getFlatsIds(groupedFlats, currentSection, currentLevel)
    };

    const FLAT_LAYOUTS_QUERY = isPublic ? GET_PUBLISHED_FLATS_EXTENDED : GET_FLATS_LAYOUTS_EXTENDED;

    const queryVariables = isPublic ? publicVariables : variables;

    const {data: flatsData, loading: flatsLoading, error: flatsError} = useQuery(FLAT_LAYOUTS_QUERY, {
        variables: {
            ...queryVariables
        },
        fetchPolicy: 'cache-and-network'
    });

    if (flatsLoading) {
        return <div>Loading...</div>;
    }

    if (flatsError) {
        return <div>Error...</div>;
    }

    // TODO type this
    let fullFlatsInfo: any = [];
    let image: any = {};

    if (isPublic) {
        const {
            getPublishedFlatsLayoutByHouseId: {fullFlatsInfo: info, image: img}
        } = flatsData;
        fullFlatsInfo = info || [];
        image = img;
    } else {
        const {
            getFlatsLayoutsByIds: {fullFlatsInfo: info, image: img}
        } = flatsData;
        fullFlatsInfo = info;
        image = img;
    }

    console.log('flatsData');
    console.log(flatsData);

    // TODO type this
    let info: any = isPublic ? getInfo(fullFlatsInfo, currentDataId) : getInfo(fullFlatsInfo, currentDataId);

    // TODO refactor this (may be utils)
    const toDraw = fullFlatsInfo.map(({svgInfo, flatInfo}) => ({
        ...svgInfo,
        status: flatInfo.status,
        flatInfo
    }));

    return (
        <FloorViewContainer>
            <FloorLegendInfo>
                <FloorLegendItem color="#4caf50">
                    <div></div>
                    <span>Свободно</span>
                </FloorLegendItem>
                <FloorLegendItem color="#ffeb3b">
                    <div></div>
                    <span>Резерв / Забронировано</span>
                </FloorLegendItem>
                <FloorLegendItem color="#f44336">
                    <div></div>
                    <span>Продано</span>
                </FloorLegendItem>
                <FloorLegendItem color="#00bcd4">
                    <div></div>
                    <span>Оформление документов</span>
                </FloorLegendItem>
                <FloorLegendItem color="#9e9e9e">
                    <div></div>
                    <span>Недоступно</span>
                </FloorLegendItem>

                <div style={{marginLeft: 'auto'}}>
                    <Select value={currentSection} style={{marginRight: '20px'}}>
                        {Object.values(sections).map((item: any) => {
                            return (
                                <MenuItem key={item.id} value={item.id} onClick={() => setCurrentSection(item.id)}>
                                    {`Подъезд ${item.section}`}
                                </MenuItem>
                            );
                        })}
                    </Select>

                    <Button variant="outlined" color="primary">
                        Подробнее
                    </Button>
                </div>
            </FloorLegendInfo>

            <div style={{display: 'flex'}}>
                <FloorsListContainer>
                    {sections[currentSection].levels.map(({id, level}, index) => {
                        return (
                            <FloorsListItem
                                key={id}
                                onClick={() => {
                                    setCurrentLevel(id);
                                }}
                            >
                                {`Этаж ${level}`}
                            </FloorsListItem>
                        );
                    })}
                </FloorsListContainer>
                <FloorContentContainer>
                    <FlatInfo>
                        {info ? (
                            <>
                                <span>{`№${info.flatNumber}`}</span>
                                <span>{`Статус: ${info.status}`}</span>
                                <span>{`Цена: ${info.price}`}</span>
                                <span>{`М2: ${info.area}`}</span>
                                <span>{`Цена м2: ${info.squarePrice}`}</span>
                                <span>{`Комнат: ${info.roomAmount}`}</span>
                                <span>{`Этажей: ${info.levelAmount}`}</span>
                            </>
                        ) : (
                            <span>Наведите на квартиру</span>
                        )}
                    </FlatInfo>
                    <div>
                        {fullFlatsInfo.length && (
                            <LayoutView
                                isLarge={true}
                                onSelect={onSelect}
                                levelLayouts={toDraw}
                                floorImage={image}
                                setCurrentDataId={setCurrentDataId}
                            />
                        )}
                    </div>
                </FloorContentContainer>
            </div>
        </FloorViewContainer>
    );
};
