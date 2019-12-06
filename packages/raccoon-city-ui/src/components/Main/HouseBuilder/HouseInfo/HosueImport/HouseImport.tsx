import React from 'react';
import {useDropzone} from 'react-dropzone';
import {DropzoneContainer} from '../../../../shared/components/styled';

function CsvDropzone(props: any) {
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: 'text/csv',
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
export function HouseImport() {
    const handleDrop = (file: any) => {};

    return <CsvDropzone onDrop={handleDrop} />;
}
