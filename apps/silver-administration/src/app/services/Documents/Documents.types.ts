export enum docTypes {
  tnc = "tnc",
  clientTerms = "client_terms"
}

export enum docID {
  tnc = "a2f19cde-cc54-46e3-a1df-d2eacd3f8bef",
  clientTerms = "edbe6da5-9702-43a4-ac7c-5540fd7b2ccc"
}

export interface IPlatformDocument {
  "id": string,
  "lastUpdatedDate": string,
  "name": string,
  "path": string,
  "type": string,
  "version": number

}
