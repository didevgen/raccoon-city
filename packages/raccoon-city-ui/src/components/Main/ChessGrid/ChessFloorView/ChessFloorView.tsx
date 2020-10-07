import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Select, MenuItem} from '@material-ui/core';
import {
    GET_PUBLISHED_FLATS_INFO_WITH_SVG_LAYOUTS,
    GET_FLATS_INFO_WITH_SVG_LAYOUTS
} from '../../../../graphql/queries/layoutQuery';
import {getSections, getInfo, getFlatsToDraw} from './ChessFloorUtils';
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
import {FLAT_STATUSES} from '../../../../core/constants';

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
        levelId: currentLevel
    };

    const FLAT_LAYOUTS_QUERY = isPublic ? GET_PUBLISHED_FLATS_INFO_WITH_SVG_LAYOUTS : GET_FLATS_INFO_WITH_SVG_LAYOUTS;

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

    // TODO think about this
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

    // TODO type this
    let info: any = getInfo(fullFlatsInfo, currentDataId);

    const flatsToDraw = getFlatsToDraw(fullFlatsInfo);

    // TODO may be divide
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
                                <span>
                                    {`Статус: ${
                                        FLAT_STATUSES.find((statuses) => statuses.value === info.status)?.label
                                    }`}
                                </span>
                                <span>{`Цена: ${info.price}`}</span>
                                <span>{`М2: ${info.area}`}</span>
                                <span>{`Цена м2: ${info.squarePrice}`}</span>
                                <span>{`Комнат: ${info.roomAmount}`}</span>
                                <span>{`Кол-во уровней: ${info.levelAmount}`}</span>
                            </>
                        ) : (
                            <span>Наведите на квартиру</span>
                        )}
                    </FlatInfo>
                    <div>
                        {Boolean(fullFlatsInfo.length) && (
                            <LayoutView
                                isLarge={true}
                                onSelect={onSelect}
                                levelLayouts={flatsToDraw}
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
