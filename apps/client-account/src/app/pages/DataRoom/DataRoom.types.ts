export interface IDataRoomProps {}

export interface IDataRoomContext {
  onViewPlatformTermsAndConditions: () => void;
  onViewClientTermsAndConditions: () => void;
  onViewFeeSchedule: () => void;
  showPlatformTermsModal: boolean;
  onAcceptPlatformTerms: () => void;
  onDownloadPlatformTerms: () => void;
  onPrintPlatformTerms: () => void;
  onSharePlatformTerms: () => void;
  onRejectPlatformTerms: () => void;
  showClientTermsModal: boolean;
  onAcceptClientTerms: () => void;
  onDownloadClientTerms: () => void;
  onPrintClientTerms: () => void;
  onShareClientTerms: () => void;
  onRejectClientTerms: () => void;
}
