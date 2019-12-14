import {useMutation} from '@apollo/react-hooks';
import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useParams} from 'react-router-dom';
import {UPLOAD_SPREADSHEET} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {DropzoneContainer} from '../../../../shared/components/styled';
import {HouseMatch} from '../HouseMatch/HouseMatch';

function CsvDropzone(props: any) {
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: '.csv',
        onDrop: (acceptedFiles) => {
            props.onDrop(acceptedFiles[0]);
        }
    });

    return (
        <div className="container">
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
        const result = await uploadFile({
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
