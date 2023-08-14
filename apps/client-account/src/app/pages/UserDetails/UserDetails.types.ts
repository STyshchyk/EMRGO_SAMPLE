import { IUser } from "@emrgo-frontend/types";

import { IEditCorporateLegalNameModalFormProps } from "./EditCorporateLegalNameModal";
import { IEditEmailAddressModalFormProps } from "./EditEmailAddressModal/EditEmailAddressModal.types";
import { IEditNameModalFormProps } from "./EditNameModal/EditNameModal.types";
import {
  IEditPhoneNumberModalFormProps,
  IVerifyPhoneNumberModalFormProps,
} from "./EditPhoneNumberModal/EditPhoneNumberModal.types";

export interface IUserDetailsProps {}

export interface IUserDetailsContext {
  user?: IUser | null;

  isEditNameModalOpen: boolean;
  setStateOfEditNameModal: (state: boolean) => void;
  onEditName: (values: IEditNameModalFormProps) => void;

  isEditCorporateLegalNameModalOpen: boolean;
  setStateOfEditCorporateLegalNameModal: (state: boolean) => void;
  onUpdateCorporateLegalName: (values: IEditCorporateLegalNameModalFormProps) => void;

  isEditEmailAddressModalOpen: boolean;
  setStateOfEditEmailAddressModal: (state: boolean) => void;
  onUpdateEmailAddress: (values: IEditEmailAddressModalFormProps) => void;

  isMobileModalTypeAdd: boolean;
  setModalTypeAddState: (state: boolean) => void;
  isEditCorporateMobileNumberModalOpen: boolean;
  setStateOfEditCorporateMobileNumberModal: (state: boolean, isAdd: boolean) => void;
  onAddCorporateMobileNumber: (values: IEditPhoneNumberModalFormProps) => void;
  onUpdateCorporateMobileNumber: (values: IEditPhoneNumberModalFormProps) => void;
  isOTPCodeModalOpen: boolean;
  setStateOfOTPCodeModal: (state: boolean) => void;
  onVerifyCorporateMobileNumber: (values: IVerifyPhoneNumberModalFormProps) => void;

  onLogOut: () => void;
}
