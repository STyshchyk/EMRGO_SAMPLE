export interface IDashboardWrapperProps {
}

export interface IDashboardWrapperContext {
  numberOfNotifications: number;
  showClientTermsModal: boolean;
  onAcceptTerms: () => void;
  onDownloadTerms: () => void;
  onPrintTerms: () => void;
  onShareTerms: () => void;
  onRejectTerms: () => void;
}
