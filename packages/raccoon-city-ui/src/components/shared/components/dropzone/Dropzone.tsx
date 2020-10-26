import React from 'react';
import {useDropzone} from 'react-dropzone';
import {DropzoneContainer} from '../styled';

export function StyledDropzone(props: any) {
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            props.onDrop(acceptedFiles[0]);
        }
    });
    return (
        <div className="container">
            <DropzoneContainer {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                <input {...getInputProps()} />
                {props.ratio ? (
                    <p>
                        Нажмите или перенесите изображение сюда. Предпочтительные размеры изображений:{' '}
                        {props.ratio.join(', ')}
                    </p>
                ) : (
                    <p>Нажмите или перенесите изображение сюда</p>
                )}
            </DropzoneContainer>
        </div>
    );
}
