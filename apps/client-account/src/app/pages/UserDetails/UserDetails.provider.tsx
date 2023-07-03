import { createContext, PropsWithChildren, useContext, useState } from "react";

import { clientAuthenticationRoutes, queryKeys } from "@emrgo-frontend/constants";
import { logoutUser } from "@emrgo-frontend/services";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IEditCorporateLegalNameModalFormProps } from "./EditCorporateLegalNameModal";
import { IEditEmailAddressModalFormProps } from "./EditEmailAddressModal/EditEmailAddressModal.types";
import { IEditNameModalFormProps } from "./EditNameModal/EditNameModal.types";
import {
  IEditPhoneNumberModalFormProps,
  IVerifyPhoneNumberModalFormProps,
} from "./EditPhoneNumberModal/EditPhoneNumberModal.types";
import {
  addMobileNumber,
  editCorporateLegalName,
  editEmailAddress,
  editMobileNumber,
  editName,
  verifyMobileNumber,
} from "./UserDetails.service";
import { IUserDetailsContext } from "./UserDetails.types";

const UserDetailsContext = createContext<IUserDetailsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const UserDetailsProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { showSuccessToast } = useToast();
  // const user = mockedUser;
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doEditName } = useMutation(editName);
  const { mutate: doEditCorporateLegalName } = useMutation(editCorporateLegalName);
  const { mutate: doEditEmailAddress } = useMutation(editEmailAddress);
  const { mutate: doAddMobileNumber } = useMutation(addMobileNumber);
  const { mutate: doEditMobileNumber } = useMutation(editMobileNumber);
  const { mutate: doVerifyMobileNumber } = useMutation(verifyMobileNumber);

  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isEditCorporateLegalNameModalOpen, setIsEditCorporateLegalNameModalOpen] = useState(false);
  const [isEditEmailAddressModalOpen, setIsEditEmailAddressModalOpen] = useState(false);
  const [isEditCorporateMobileNumberModalOpen, setIsEditCorporateMobileNumberModalOpen] =
    useState(false);
  const [isOTPCodeModalOpen, setIsOTPCodeModalOpen] = useState(false);
  const [isMobileModalTypeAdd, setIsMobileModalTypeAdd] = useState(true);

  // Name
  const setStateOfEditNameModal = (state: boolean) => {
    setIsEditNameModalOpen(state);
  };

  const refreshProfile = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.account.profile.fetch],
      exact: true,
    });
  };

  const onEditName = (values: IEditNameModalFormProps) => {
    const requestPayload = {
      ...values,
      email: user?.email,
      phone: user?.phone,
    };
    doEditName(requestPayload, {
      onSuccess: (response) => {
        refreshProfile();
        setIsEditNameModalOpen(false);
        showSuccessToast("Successfully updated your name");
      },
    });
  };

  // Corporate Legal Name
  const setStateOfEditCorporateLegalNameModal = (state: boolean) => {
    setIsEditCorporateLegalNameModalOpen(state);
  };

  const onUpdateCorporateLegalName = (values: IEditCorporateLegalNameModalFormProps) => {
    const requestPayload = {
      name: values.name,
    };
    doEditCorporateLegalName(requestPayload, {
      onSuccess: (response) => {
        refreshProfile();
        setIsEditCorporateLegalNameModalOpen(false);
        showSuccessToast("Successfully updated your entities legal name");
      },
    });
  };

  const onUpdateEmailAddress = (values: IEditEmailAddressModalFormProps) => {
    const requestPayload = {
      ...values,
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
    };
    doEditEmailAddress(requestPayload, {
      onSuccess: (response) => {
        refreshProfile();
        setIsEditEmailAddressModalOpen(false);
        showSuccessToast("Successfully sent the verification email");
      },
    });
  };

  // Coporate Mobile Number
  const setModalTypeAddState = (state: boolean) => {
    setIsMobileModalTypeAdd(state);
  };

  const setStateOfEditCorporateMobileNumberModal = (state: boolean, isAdd: boolean) => {
    setIsMobileModalTypeAdd(isAdd);
    setIsEditCorporateMobileNumberModalOpen(state);
  };

  const onAddCorporateMobileNumber = (values: IEditPhoneNumberModalFormProps) => {
    const requestPayload = {
      ...values,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    };
    doAddMobileNumber(requestPayload, {
      onSuccess: (response) => {
        setIsOTPCodeModalOpen(true);
        setIsEditCorporateMobileNumberModalOpen(false);
      },
    });
  };

  const onVerifyCorporateMobileNumber = (values: IVerifyPhoneNumberModalFormProps) => {
    const requestPayload = {
      ...values,
    };
    doVerifyMobileNumber(requestPayload, {
      onSuccess: (response) => {
        setIsOTPCodeModalOpen(false);
        showSuccessToast("Successfully updated your corporate mobile number");
        refreshProfile();
      },
    });
  };

  const onUpdateCorporateMobileNumber = (values: IEditPhoneNumberModalFormProps) => {
    const requestPayload = {
      ...values,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    };
    doEditMobileNumber(requestPayload, {
      onSuccess: (response) => {
        setIsOTPCodeModalOpen(true);
        setIsEditCorporateMobileNumberModalOpen(false);
      },
    });
  };

  const setStateOfOTPCodeModal = (state: boolean) => {
    setIsOTPCodeModalOpen(state);
  };

  const setStateOfEditEmailAddressModal = (state: boolean) => {
    setIsEditEmailAddressModalOpen(state);
  };

  const onLogOut = () => {
    const requestPayload = null;
    doLogoutUser(requestPayload, {
      onSuccess: (response) => {
        navigateModule("authentication", clientAuthenticationRoutes.home);
      },
    });
  };

  const state: IUserDetailsContext = {
    user,
    isEditNameModalOpen,
    setStateOfEditNameModal,
    onEditName,

    isEditCorporateLegalNameModalOpen,
    setStateOfEditCorporateLegalNameModal,
    onUpdateCorporateLegalName,

    isEditEmailAddressModalOpen,
    setStateOfEditEmailAddressModal,
    onUpdateEmailAddress,

    isMobileModalTypeAdd,
    setModalTypeAddState,
    isEditCorporateMobileNumberModalOpen,
    setStateOfEditCorporateMobileNumberModal,
    onAddCorporateMobileNumber,
    onUpdateCorporateMobileNumber,
    isOTPCodeModalOpen,
    setStateOfOTPCodeModal,
    onVerifyCorporateMobileNumber,

    onLogOut,
  };

  return <UserDetailsContext.Provider value={state}>{children}</UserDetailsContext.Provider>;
};

export const useUserDetailsContext = () => useContext(UserDetailsContext);
