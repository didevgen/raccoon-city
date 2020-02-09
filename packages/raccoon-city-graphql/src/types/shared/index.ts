export interface KeyDisplayName {
    key: string;
    displayName: string;
}

export interface SingleImage {
    uuid: string;
    downloadUrl: string;
}

export interface NamedImage extends SingleImage {
    name: string;
}

export interface SinglePreviewImage extends SingleImage {
    previewImageUrl: string;
}

export interface PreviewImage extends NamedImage {
    previewImageUrl: string;
}
