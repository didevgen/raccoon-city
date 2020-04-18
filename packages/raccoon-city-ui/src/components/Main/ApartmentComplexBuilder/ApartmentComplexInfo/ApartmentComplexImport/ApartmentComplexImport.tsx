import {useMutation} from '@apollo/react-hooks';
import {Button} from '@material-ui/core';
import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {UPLOAD_SPREADSHEET} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {DropzoneContainer} from '../../../../shared/components/styled';
import {HouseMatch} from '../HouseMatch/HouseMatch';

const StyledLink = styled.a`
    text-decoration: none;
    button {
        margin-bottom: 8px;
    }
`;

function CsvDropzone(props: any) {
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: '.csv',
        onDrop: (acceptedFiles) => {
            props.onDrop(acceptedFiles[0]);
        }
    });

    return (
        <div className="container">
            <StyledLink href={'http://d2wn3f22rkbhe4.cloudfront.net/Template.csv'}>
                <Button variant="outlined" color="primary">
                    Скачать пример
                </Button>
            </StyledLink>
            <DropzoneContainer {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </DropzoneContainer>
        </div>
    );
}

export function ApartmentComplexImport() {
    const {uuid} = useParams();
    const [matching, setMatching] = useState(false);
    const [uploadFile, {data}] = useMutation(UPLOAD_SPREADSHEET);
    const handleDrop = async (file: any) => {
        await uploadFile({
            variables: {
                file,
                uuid
            }
        });

        setMatching(true);
    };

    if (matching) {
        return (
            <HouseMatch
                data={data.uploadApartmentComplexFile}
                apartmentComplexUuid={uuid || ''}
                onCancel={() => {
                    setMatching(false);
                }}
            />
        );
    }

    return <CsvDropzone onDrop={handleDrop} />;
}
