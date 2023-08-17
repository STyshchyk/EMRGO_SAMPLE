import { dashboardApi } from "../../services/APIService";
import { IEditCorporateLegalNameModalFormProps } from "./EditCorporateLegalNameModal";
import { IEditEmailAddressModalFormProps } from "./EditEmailAddressModal/EditEmailAddressModal.types";
import { IEditNameModalFormProps } from "./EditNameModal/EditNameModal.types";
import {
  IEditPhoneNumberModalFormProps,
  IVerifyPhoneNumberModalFormProps,
} from "./EditPhoneNumberModal/EditPhoneNumberModal.types";

// import {} from "./UserDetails.types";

export const editName = (requestObject: IEditNameModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/profile`,
  });
  return promise;
};

export const editCorporateLegalName = (requestObject: IEditCorporateLegalNameModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/client/entity`,
  });
  return promise;
};

export const editEmailAddress = (requestObject: IEditEmailAddressModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/profile`,
  });
  return promise;
};

export const addMobileNumber = (requestObject: IEditPhoneNumberModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/profile`,
  });
  return promise;
};

export const editMobileNumber = (requestObject: IEditPhoneNumberModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/profile`,
  });
  return promise;
};

export const verifyMobileNumber = (requestObject: IVerifyPhoneNumberModalFormProps) => {
  const promise = dashboardApi({
    method: "put",
    data: requestObject,
    url: `/auth/v2/profile/change-phone`,
  });
  return promise;
};
