import { TSecureAccountFlowOption } from "../DashboardWrapper.types";

export interface ISecureYourAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSecureByText: () => void;
  onSecureByApp: () => void;
}
