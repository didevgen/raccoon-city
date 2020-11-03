import {useQuery} from '@apollo/react-hooks';
import React, {useEffect, useState} from 'react';
import {
    GET_FLATS_INFO_WITH_SVG_LAYOUTS,
    GET_PUBLISHED_FLATS_INFO_WITH_SVG_LAYOUTS
} from '../../../../graphql/queries/layoutQuery';
import {ChessGridAnimation} from '../ChessGridAnimation/ChessGridAnimation';
import {LayoutView} from '../FlatSidebarInfo/LayoutView';
import {FullFlatInfoInterface, LevelImageUrlInterface} from './ChessFloor.interfaces';
import {getFlatsToDraw, getInfo, getSections} from './ChessFloorUtils';
import {
    FloorContainer,
    FloorContentContainer,
    FloorLegendInfo,
    FloorsListContainer,
    FloorsListItem,
    FloorViewContainer,
    LevelSelectMobile,
    WarningContainer,
    WarningContainerColumn
} from './ChessFloorView.styled';
import {CustomSelector} from './FloorViewsParts/CustomSelector';
import {FlatInfoBar} from './FloorViewsParts/FlatInfoBar';

export const ChessFloorView = (props) => {
    const {onSelect, houseFlats, isPublic, setCurrentLevel: handleCurrentLevelChange} = props;

    // TODO handle error if houseFlats[0] === undefined
    const {groupedFlats} = houseFlats[0];

    const [sections] = useState(getSections(groupedFlats));
    const [currentSection, setCurrentSection] = useState(Object.keys(sections)[0]);
    const [currentLevel, setCurrentLevel] = useState(sections[currentSection]?.levels[0].id);
    const [currentDataId, setCurrentDataId] = useState('');

    const publicVariables = {
        houseId: houseFlats[0].id,
        sectionId: currentSection,
        levelId: currentLevel
    };

    const variables = {
        levelId: currentLevel
    };

    useEffect(() => {
        handleCurrentLevelChange(currentLevel);
    }, [currentLevel, handleCurrentLevelChange]);

    const FLAT_LAYOUTS_QUERY = isPublic ? GET_PUBLISHED_FLATS_INFO_WITH_SVG_LAYOUTS : GET_FLATS_INFO_WITH_SVG_LAYOUTS;

    const queryVariables = isPublic ? publicVariables : variables;

    const {data: flatsData, loading: flatsLoading, error: flatsError} = useQuery(FLAT_LAYOUTS_QUERY, {
        variables: {
            ...queryVariables
        },
        fetchPolicy: 'cache-and-network'
    });

    if (flatsLoading) {
        return <ChessGridAnimation />;
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

            <FloorContainer>
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
            </FloorContainer>
        </FloorViewContainer>
    );
};
