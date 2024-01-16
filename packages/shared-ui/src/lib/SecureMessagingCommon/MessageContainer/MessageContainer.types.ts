import { PropsWithChildren } from "react";

export interface IMessageContainerProps extends PropsWithChildren {
  isSendMode?: boolean;
  sendMode: TSendMode;
  messsageList?: any;
}

type TSendMode = "client" | "internal";
