export interface SinglePreviewImage {
    uuid: string;
    downloadUrl: string;
    previewImageUrl: string;
}

export interface HouseLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
}
