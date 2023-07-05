export interface IDataRoomProps {}

export interface IDataRoomContext {
  onViewPlatformTermsAndConditions: () => void;
  onViewClientTermsAndConditions: () => void;
  onViewFeeSchedule: () => void;
  showPlatformTermsModal: boolean;
  onAcceptPlatformTerms: () => void;
  onRejectPlatformTerms: () => void;
  showClientTermsModal: boolean;
  onAcceptClientTerms: () => void;
  onRejectClientTerms: () => void;
  clientTermsDocumentURL: string;
  platformTermsDocumentURL: string;
}
