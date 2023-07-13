import { FormikProps } from "formik";

export enum UserRoles {
  operationsPlatformSolutions = "operations",
  relationshipManagerSales = "relationship_manager",
  compliance = "compliance",
  finance = "finance",
  superUser = "super_user",
}

export interface IInviteUserProps {}

export interface IInviteUserContex {
  form: FormikProps<IInviteUserValues>;
  validationSchema: object;
}

export interface IInviteUserValues {
  firstName: string;
  lastName: string;
  role: UserRoles | null;
  email: string;
}
