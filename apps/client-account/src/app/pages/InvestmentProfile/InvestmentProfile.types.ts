import { IKYCSectionItemProps } from "../../components/KYCSectionItem";

export interface IInvestmentProfileProps {}

export interface IInvestmentProfileContext {
  firstName: string;
  forms?: IInvestmentProfileSection[];
  onStartForm: (formId: string, formReferenceId: string) => void;
  onSubmit: () => void;
}

export interface IInvestProfileResponse {
  forms: IInvestmentProfileSection[];
}

export interface IInvestmentProfileSection extends IKYCSectionItemProps {}

export interface ICreateFormSessionRequestPayload {
  formReferenceId: string;
}

export interface ICreateFormSessionResponsePayload {
  sessionId: string;
}
