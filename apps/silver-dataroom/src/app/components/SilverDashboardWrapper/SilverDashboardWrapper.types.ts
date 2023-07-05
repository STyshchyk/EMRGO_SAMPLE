export interface ISilverDashboardWrapperProps {
}

export interface ISilverDashboardWrapperContext {
  numberOfNotifications: number;
  showClientTermsModal: boolean;
  onAcceptTerms: () => void;
  onDownloadTerms: () => void;
  onPrintTerms: () => void;
  onShareTerms: () => void;
  onRejectTerms: () => void;
}
