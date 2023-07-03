export interface IClientTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  onReject: () => void;
}
