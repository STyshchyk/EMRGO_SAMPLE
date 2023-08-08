import { PropsWithChildren } from "react";


export interface IUserItemProps extends PropsWithChildren {
  handleCallback: () => void;
}
