import {Icon} from '@material-ui/core';
import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import React from 'react';
import {FLAT_STATUSES} from '../../../../core/constants';
import {SidebarFlat} from '../../../../graphql/queries/flatQuery';
import {CustomButton} from './styledComponents';

interface SidebarPdfInfoProps {
    flat: SidebarFlat;
    userInfo: {
        name: string | null;
        role: {displayName: string};
    } | null;
}

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        fontFamily: 'Roboto',
        display: 'flex',
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35
    },
    title: {
        marginTop: -15,
        fontSize: 16,
        paddingBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    flatNumber: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    status: {
        fontSize: 14
    },
    image: {
        marginVertical: 8,
        marginHorizontal: 150,
        maxWidth: 200
    },
    table: {
        fontSize: 12,
        width: 'auto',
        borderStyle: 'solid'
    },
    td: {
        width: '50%'
    },
    value: {
        width: '50%',
        textAlign: 'right'
    }
});

const TR = styled.View`
    flex-direction: row;
    margin: auto;
    width: 100%;
    border-bottom-width: 1px;
    border-color: #ccc;
    border-bottom-style: solid;
    padding: 8px;
    font-size: 12px;
`;

const ImageWrapper = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;

const LogoImageWrapper = styled(ImageWrapper)`
    width: 60%;
`;

const Logo = styled.Image`
    max-height: 100px;
    margin-bottom: 8px;
    max-width: 100px;
    height: auto;
`;

const StyledImage = styled.Image`
    margin-top: 2px;
    max-width: 50%;
    left: 25%;
    justify-self: center;
`;

const Call = styled.Text`
    font-size: 13px;
    margin-top: 8px;
    text-align: center;
`;

const NumberSection = styled.View`
    display: flex;
    flex-direction: row;
    justify-self: end;
`;

const HeaderWrapper = styled.View`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    margin-top: -20px;
`;

const InfoWrapper = styled.View`
    display: flex;
    justify-content: center;
    width: 40%;
`;

const PhoneSection = styled.View`
    margin: 8px;
    font-size: 10px;
`;

const PhoneSectionTitle = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

const CustomPDFDownloadLink = styled(PDFDownloadLink)`
    text-decoration: none;
`;

function FlatTable({flat, userInfo}: SidebarPdfInfoProps) {
    let manager: string | null = null;

    if (userInfo) {
        const role = userInfo?.role?.displayName || '';
        console.log(role);
        manager = `${userInfo.name} ${role}`;
    }

    return (
        <View style={styles.table}>
            {flat.price ? (
                <TR>
                    <View style={styles.td}>
                        <Text>Полная цена</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>{flat.price} грн</Text>
                    </View>
                </TR>
            ) : null}
            {flat.squarePrice ? (
                <TR>
                    <View style={styles.td}>
                        <Text>Цена за метр</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>{flat.squarePrice} грн</Text>
                    </View>
                </TR>
            ) : null}
            <TR>
                <View style={styles.td}>
                    <Text>Площадь</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.area}</Text>
                </View>
            </TR>
            <TR>
                <View style={styles.td}>
                    <Text>Объект</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.house.name}</Text>
                </View>
            </TR>
            <TR>
                <View style={styles.td}>
                    <Text>Подъезд</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.section}</Text>
                </View>
            </TR>
            <TR>
                <View style={styles.td}>
                    <Text>Количество комнат</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.roomAmount}</Text>
                </View>
            </TR>
            <TR>
                <View style={styles.td}>
                    <Text>Дата</Text>
                </View>
                <View style={styles.value}>
                    <Text>{new Date().toLocaleDateString()}</Text>
                </View>
            </TR>
            {manager ? (
                <TR>
                    <View style={styles.td}>
                        <Text>Имя/Роль</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>{manager}</Text>
                    </View>
                </TR>
            ) : null}
        </View>
    );
}

const makeHttps = (url?: string) => {
    if (!url) {
        return url;
    }

    return url.replace('http://', 'https://');
};
const FlatPdf = ({flat, userInfo}: SidebarPdfInfoProps) => {
    const status = FLAT_STATUSES.find((item) => item.value === flat.status);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <HeaderWrapper>
                    {flat.developer.logo && (
                        <LogoImageWrapper>
                            <Logo src={makeHttps(flat.developer.logo.downloadUrl)} />
                        </LogoImageWrapper>
                    )}

                    <InfoWrapper>
                        <Call>По всем вопросам:</Call>
                        <NumberSection>
                            <PhoneSection>
                                <PhoneSectionTitle>Приемная</PhoneSectionTitle>
                                {flat.developer.receptionNumbers.map((phone, i) => {
                                    return <Text key={phone + i}>{phone}</Text>;
                                })}
                            </PhoneSection>
                            <PhoneSection>
                                <PhoneSectionTitle>Отдел продаж</PhoneSectionTitle>
                                {flat.developer.salesNumbers.map((phone, i) => {
                                    return <Text key={phone + i}>{phone}</Text>;
                                })}
                            </PhoneSection>
                        </NumberSection>
                    </InfoWrapper>
                </HeaderWrapper>
                <Text style={styles.title}>ЖК {flat.apartmentComplex.name}</Text>
                <Text style={styles.flatNumber}>
                    Квартира №{flat.flatNumber} {status?.label}
                </Text>
                {flat.layout && (
                    <ImageWrapper>
                        <StyledImage src={makeHttps(`${flat.layout?.image.previewImageUrl}?x-some-key=some-value`)} />
                    </ImageWrapper>
                )}
                <FlatTable flat={flat} userInfo={userInfo} />
            </Page>
        </Document>
    );
};

export function SidebarPdfInfo({flat, userInfo}: SidebarPdfInfoProps) {
    return (
        <CustomPDFDownloadLink
            document={<FlatPdf userInfo={userInfo} flat={flat} />}
            fileName={`${flat.flatNumber}.pdf`}
        >
            {({blob, url, loading, error}) =>
                loading ? (
                    'Loading document...'
                ) : (
                    <CustomButton variant="contained" endIcon={<Icon>print</Icon>}>
                        Скачать PDF
                    </CustomButton>
                )
            }
        </CustomPDFDownloadLink>
    );
}
