export interface FileDataDTO {
  id?: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  mimeType: string;
}