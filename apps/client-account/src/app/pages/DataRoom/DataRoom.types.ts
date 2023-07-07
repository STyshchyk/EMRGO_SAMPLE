import { IUser } from "@emrgo-frontend/types";

export interface IDataRoomProps {}

export interface IDataRoomContext {
  user: IUser | null;
  
  onViewPlatformTermsAndConditions: () => void;
  onViewClientTermsAndConditions: () => void;
  onAcceptPlatformTerms: () => void;
  onRejectPlatformTerms: () => void;
  onAcceptClientTerms: () => void;
  onRejectClientTerms: () => void;

  showTermsModal: string;
  termsDocumentURL: string;
}
