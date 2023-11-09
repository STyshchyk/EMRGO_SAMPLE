import { Dispatch, SetStateAction } from "react";

import { IResetPasswordValues,IUser, TResetPasswordFlowView, TSecureAccountFlowView } from "@emrgo-frontend/types";

export interface IAccountSecurityProps {}

export interface IAccountSecurityContext {
  user: IUser | null;
  onResetPasswordClick: () => void;
  onResetMFAClick: () => void;
  onSetupMFAClick: () => void;
  onCloseSecureAccountFlowClick: () => void;

  onResetMFA: () => void;
  onSetupMFA: (otp: string) => void;
  onVerifyResetMFA: (code: string) => void;
  secureAccountFlowView: TSecureAccountFlowView;
  setSecureAccountFlowView: Dispatch<SetStateAction<TSecureAccountFlowView>>;
  onResetPassword: (values:IResetPasswordValues) => void;
  resetPasswordFlowView: TResetPasswordFlowView;
  setResetPasswordFlowView: Dispatch<SetStateAction<TResetPasswordFlowView>>;

  isQRCodeLoading: boolean;
  authenticatorURL: string;
}
