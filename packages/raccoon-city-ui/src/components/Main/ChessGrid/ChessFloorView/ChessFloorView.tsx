import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
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
    LevelSelectMobile,
    FloorLegendInfo,
    WarningContainer,
    WarningContainerColumn
} from './ChessFloorView.styled';
import {LayoutView} from '../FlatSidebarInfo/LayoutView';
import {CustomSelector} from './FloorViewsParts/CustomSelector';
import {FlatStatusesBar} from './FloorViewsParts/FlatStatusesBar';
import {FlatInfoBar} from './FloorViewsParts/FlatInfoBar';
import {FullFlatInfoInterface, LevelImageUrlInterface} from './ChessFloor.interfaces';

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

    let fullFlatsInfo: FullFlatInfoInterface[] | [] = [];
    let image: LevelImageUrlInterface;

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

    const info = getInfo(fullFlatsInfo, currentDataId);

    const flatsToDraw = getFlatsToDraw(fullFlatsInfo);

    let contentView: any = null;

    if (!image?.previewImageUrl) {
        contentView = (
            <WarningContainer>
                <p>К этому этажу не привязана планировка</p>
            </WarningContainer>
        );
    } else {
        contentView = (
            <WarningContainerColumn>
                <p>На этом этаже нет планировок квартир</p>
                <img src={image?.previewImageUrl} alt="level url" />
            </WarningContainerColumn>
        );
    }

    if (fullFlatsInfo.length) {
        contentView = (
            <LayoutView
                isLarge={true}
                onSelect={onSelect}
                levelLayouts={flatsToDraw}
                floorImage={image}
                setCurrentDataId={setCurrentDataId}
            />
        );
    }

    const currentValueTest = (sectionId) => {
        setCurrentSection(sectionId);
        const {levels} = sections[sectionId];

        if (!levels.length) {
            return;
        }

        setCurrentLevel(levels[0].id);
    };

    return (
        <FloorViewContainer>
            <FlatStatusesBar />

            <FloorLegendInfo>
                <CustomSelector
                    currentValue={currentSection}
                    setValue={currentValueTest}
                    isPublic={isPublic}
                    items={Object.values(sections)}
                    itemName="Подъезд"
                    keyToShow="section"
                />

                <LevelSelectMobile>
                    <CustomSelector
                        currentValue={currentLevel}
                        setValue={setCurrentLevel}
                        isPublic={isPublic}
                        items={sections[currentSection].levels}
                        itemName="Этаж"
                        keyToShow="level"
                    />
                </LevelSelectMobile>

                <FlatInfoBar info={info} />
            </FloorLegendInfo>

            <div style={{display: 'flex'}}>
                <FloorsListContainer>
                    {sections[currentSection].levels.map(({id, level}) => {
                        return (
                            <FloorsListItem
                                key={id}
                                onClick={() => {
                                    setCurrentLevel(id);
                                }}
                                isPublic={isPublic}
                            >
                                {`Этаж ${level}`}
                            </FloorsListItem>
                        );
                    })}
                </FloorsListContainer>
                <FloorContentContainer>{contentView}</FloorContentContainer>
            </div>
        </FloorViewContainer>
    );
};
