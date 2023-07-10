
export interface IEntity {
  entityId: string,
  entityKycStatus: kycStatusType,
  entityKycSubmissionDate: string,
  entityName: string,
  firstName: string,
  lastName: string,
  email: string,
  userId: string,
  userKycStatus: kycStatusType,
  userKycSubmissionDate: string,
}


export enum kycType {
  "user" = "user",
  "entity" = "entity"
}

export enum kycStatusType {
  "KYC_STATUS_PENDING" = 1,
  "KYC_STATUS_SUBMITTED" = 2,
  "KYC_STATUS_APPROVED" = 3,
  "KYC_STATUS_REJECTED" = 4,
}

const kycLabel: Record<kycStatusType, string> = {
  [kycStatusType.KYC_STATUS_APPROVED]: "Approved",
  [kycStatusType.KYC_STATUS_SUBMITTED]: "Submitted",
  [kycStatusType.KYC_STATUS_PENDING]: "Pending",
  [kycStatusType.KYC_STATUS_REJECTED]: "Rejected"
};

export const getKycLabel = (status: kycStatusType) => {
  return kycLabel[status];
};

export interface IKycSubmit {
  id: string,
  isApproved: boolean,
  kycType:kycType
}
