export interface ITermsModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  documentURL: string;
  hasAccepted?: boolean;
  onAccept?: () => void;
  onReject: () => void;
}
