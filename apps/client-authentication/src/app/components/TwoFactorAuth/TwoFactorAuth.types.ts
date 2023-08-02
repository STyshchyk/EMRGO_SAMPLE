import { IMFA } from "../../services";

export enum MFATYPE {
  verify,
  enable,
}

export interface ITwoFactorAuthProps extends IMFA{
  position?: string;
  mode: MFATYPE;
  onEnableMFA: (otp: string) => void;
  onVerifyMFA: (otp: string) => void;


  isQRCodeLoading: boolean;
}





