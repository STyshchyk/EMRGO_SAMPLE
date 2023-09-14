export interface IDocument {
  documentType: string;
  type?: string;
  name: string;
  id: string;
  path: string;
}

export interface ISignedURL {
  url: string;
}


export interface IUploadResponse {
  fileId: string;
  filename: string;
  path: string;
  url: string;
}
