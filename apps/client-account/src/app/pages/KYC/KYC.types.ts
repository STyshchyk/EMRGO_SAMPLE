import { IKYCSectionItemProps } from "../../components/KYCSectionItem";

export interface IKYCProps {}

export interface IKYCContext {
  firstName: string;
  forms?: IKYCSection[];
  onStartForm: (formId: string, formReferenceId: string) => void;
  onSubmit: () => void;
}

export interface IKYCResponse {
  forms: IKYCSection[];
}

export interface IKYCSection extends IKYCSectionItemProps {}

export interface ICreateFormSessionRequestPayload {
  formReferenceId: string;
}

export interface ICreateFormSessionResponsePayload {
  sessionId: string;
}
