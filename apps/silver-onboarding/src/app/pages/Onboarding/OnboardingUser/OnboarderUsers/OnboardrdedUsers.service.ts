import { dashboardApi } from "../../../../services/APIService";
import { IEntity, IKycSubmit } from "./OnboardedUsers.types";

export const getEntities = async (): Promise<IEntity[]> => {
  // airtable id 531 get a list of invited users belonging to the same entity
  const promise = dashboardApi({
    method: "GET",
    url: "/auth/v2/internal/entities/users",
  });
  const data = await (await promise).data.entities;
  return data || [];
};

export const kycSubmit = (payload: IKycSubmit) => {
  return dashboardApi({
    method: "POST",
    url: "/auth/v2/internal/kyc/manage",
    data: payload,
  });
};
