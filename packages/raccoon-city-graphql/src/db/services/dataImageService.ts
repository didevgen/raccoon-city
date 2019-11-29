export interface DataImageService {
    uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void>;
    removeImage(imageUuid: string): Promise<void>;
}
