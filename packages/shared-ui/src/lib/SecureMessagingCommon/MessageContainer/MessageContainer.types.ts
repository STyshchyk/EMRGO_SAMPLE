import { PropsWithChildren } from "react";

import { IMessageData } from "@emrgo-frontend/types";

export interface IMessageContainerProps extends PropsWithChildren {
  messsageList?: IMessageData;
  isLoading: boolean;
  Key: string;
  scrollDown: boolean;
}
