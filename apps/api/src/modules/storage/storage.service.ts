export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
}

export interface IStorageService {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult>;
  getPublicUrl(key: string): string;
}

export class LocalStorageService implements IStorageService {
  private publicBaseUrl: string;

  constructor(publicBaseUrl = 'http://localhost:3000') {
    this.publicBaseUrl = publicBaseUrl;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult> {
    const key = `uploads/${Date.now()}-${fileName}`;
    return {
      url: `${this.publicBaseUrl}/${key}`,
      key,
      sizeBytes: fileBuffer.length,
    };
  }

  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }
}

export const storageService = new LocalStorageService();
