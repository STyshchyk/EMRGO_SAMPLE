export interface IClientTermsModalProps {
  isOpen: boolean;
  documentURL: string;
  onAccept: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  onReject: () => void;
}
