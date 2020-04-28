import {Button, Icon} from '@material-ui/core';
import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import React from 'react';
import {FLAT_STATUSES} from '../../../../core/constants';
import {SidebarFlat} from '../../../../graphql/queries/flatQuery';

interface SidebarPdfInfoProps {
    flat: SidebarFlat;
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
        fontSize: 24,
        paddingBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    flatNumber: {
        fontSize: 24,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    status: {
        fontSize: 18
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 150,
        maxWidth: 240
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
`;

const ImageWrapper = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;
const StyledImage = styled.Image`
    margin-top: 12px;
    max-width: 50%;
    left: 25%;
    justify-self: center;
`;

const Call = styled.Text`
    font-size: 18px;
    margin-top: 8px;
    text-align: center;
`;

const NumberSection = styled.View`
    width: 100%;
    display: flex;
    justify-self: center;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const PhoneSection = styled.View`
    margin: 8px;
    display: inline-flex;
    justify-self: center;
    font-size: 11px;
`;

const PhoneSectionTitle = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

function FlatTable({flat}: SidebarPdfInfoProps) {
    return (
        <View style={styles.table}>
            <TR>
                <View style={styles.td}>
                    <Text>Полная цена</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.price} грн</Text>
                </View>
            </TR>
            <TR>
                <View style={styles.td}>
                    <Text>Цена за метр</Text>
                </View>
                <View style={styles.value}>
                    <Text>{flat.squarePrice} грн</Text>
                </View>
            </TR>
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
        </View>
    );
}

const FlatPdf = ({flat}: SidebarPdfInfoProps) => {
    const status = FLAT_STATUSES.find((item) => item.value === flat.status);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>ЖК {flat.apartmentComplex.name}</Text>
                <Text style={styles.flatNumber}>Квартира №{flat.flatNumber}</Text>
                <Text style={styles.status}>{status?.label}</Text>
                {flat.layout && (
                    <ImageWrapper>
                        <StyledImage src={flat.layout?.image.previewImageUrl} />
                    </ImageWrapper>
                )}
                <FlatTable flat={flat} />
                <Call>По всем вопросам:</Call>
                <NumberSection>
                    <PhoneSection>
                        <PhoneSectionTitle>Приемная</PhoneSectionTitle>
                        <Text>+3805795452</Text>
                    </PhoneSection>
                    <PhoneSection>
                        <PhoneSectionTitle>Отдел продаж</PhoneSectionTitle>
                        <Text>+3805795452</Text>
                        <Text>+3805795452</Text>
                        <Text>+3805795452</Text>
                        <Text>+3805795452</Text>
                    </PhoneSection>
                </NumberSection>
            </Page>
        </Document>
    );
};

export function SidebarPdfInfo({flat}: SidebarPdfInfoProps) {
    return (
        <PDFDownloadLink document={<FlatPdf flat={flat} />} fileName={`${flat.flatNumber}.pdf`}>
            {({blob, url, loading, error}) =>
                loading ? (
                    'Loading document...'
                ) : (
                    <Button variant="contained" color="primary" endIcon={<Icon>print</Icon>}>
                        Скачать PDF
                    </Button>
                )
            }
        </PDFDownloadLink>
    );
}