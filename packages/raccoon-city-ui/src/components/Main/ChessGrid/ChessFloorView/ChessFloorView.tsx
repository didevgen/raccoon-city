import React, {useState, Fragment} from 'react';
import {
    FloorViewContainer,
    FloorsListContainer,
    FloorContentContainer,
    FloorsListItem,
    FloorLegendInfo,
    FloorLegendItem,
    FlatInfo
} from './ChessFloorView.styled';
import {Button, Select, MenuItem} from '@material-ui/core';
import {GET_LEVEL_LAYOUTS_EXTENDED, GET_FLATS_LAYOUTS_EXTENDED} from '../../../../graphql/queries/layoutQuery';
import {useQuery} from '@apollo/react-hooks';
import {GET_FLAT_SIDEBAR_DATA} from '../../../../graphql/queries/flatQuery';
import {LayoutView} from '../FlatSidebarInfo/LayoutView';
import {getSections, getFlatsIds} from './ChessFloorUtils';

export const ChessFloorView = (props) => {
    const {onSelect, houseFlats} = props;
    const {groupedFlats} = houseFlats[0];

    const [sections] = useState(getSections(groupedFlats));
    const [currentSection, setCurrentSection] = useState(Object.keys(sections)[0]);
    const [currentFloor, setCurrentFloor] = useState(sections[currentSection].levels[0].id);
    const [currentDataId, setCurrentDataId] = useState('');

    const {data, loading, error} = useQuery(GET_LEVEL_LAYOUTS_EXTENDED, {
        variables: {
            houseId: houseFlats[0].id,
            levelLayoutId: currentFloor
        },
        fetchPolicy: 'cache-and-network'
    });

    const {data: flatsData, loading: flatsLoading, error: flatsError} = useQuery(GET_FLATS_LAYOUTS_EXTENDED, {
        variables: {
            levelId: currentFloor,
            houseId: houseFlats[0].id,
            flatsIds: getFlatsIds(groupedFlats, currentSection, currentFloor)
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading || flatsLoading) {
        return null;
    }

    console.log('flatsData-------');
    console.log(flatsData);

    const {
        getFlatsLayoutsByIds: {fullFlatsInfo, image}
    } = flatsData;

    let info: any = null;

    function getInfo() {
        if (!fullFlatsInfo) {
            return;
        }

        const res = fullFlatsInfo.find(({svgInfo}) => svgInfo.id === currentDataId);
        info = res?.flatInfo;
    }

    const toDraw = fullFlatsInfo.map(({svgInfo, flatInfo: {status}}) => ({...svgInfo, status}));

    // TODO resolve this
    getInfo();

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
                                    setCurrentFloor(id);
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
