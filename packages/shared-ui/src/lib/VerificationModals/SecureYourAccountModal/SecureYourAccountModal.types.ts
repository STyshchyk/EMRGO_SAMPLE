import { TSecureAccountFlowOption } from "../SilverDashboardWrapper.types";

export interface ISecureYourAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSecureByText: () => void;
  onSecureByApp: () => void;
}
