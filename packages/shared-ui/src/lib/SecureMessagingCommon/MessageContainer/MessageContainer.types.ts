import { PropsWithChildren } from "react";

import { IMessageChain } from "@emrgo-frontend/types";

export interface IMessageContainerProps extends PropsWithChildren {
  messsageList?: IMessageChain[];
  isLoading: boolean;
  Key: string;
  scrollDown: boolean;
}
