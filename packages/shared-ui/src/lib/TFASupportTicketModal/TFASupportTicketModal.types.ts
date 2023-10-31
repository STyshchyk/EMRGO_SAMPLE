export interface ITFASupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  userType:string;
}

export interface ITFASupportTicketModalFormProps {
  type: string;
  email: string;
  file?: string;
}
