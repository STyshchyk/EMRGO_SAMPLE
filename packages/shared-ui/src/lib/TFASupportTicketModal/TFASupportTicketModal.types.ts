export interface ITFASupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export interface ITFASupportTicketModalFormProps {
  type: string;
  email: string;
  file?: string;
}
