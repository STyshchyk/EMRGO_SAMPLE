import { PropsWithChildren } from "react";

export interface IDataRoomProps extends PropsWithChildren{
}

export interface IDataRoomContext {
}

export interface IDataRoomDocument {
  "id": string,
  "lastUpdatedDate": string
  "name": string,
  "path": string,
  "type": string,
  "version": number
}
