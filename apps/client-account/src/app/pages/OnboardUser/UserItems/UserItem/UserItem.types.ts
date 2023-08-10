import { PropsWithChildren } from "react";


export interface IUserItemProps extends PropsWithChildren {
  disabled?: boolean;
  
  handleCallback: () => void;
}
