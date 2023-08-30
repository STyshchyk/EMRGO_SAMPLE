import { IQuestionnaireItemProps, IUser } from "@emrgo-frontend/types";

import { IKYCSectionItemProps } from "../../components/KYCSectionItem";

export interface IPlatformAccessProps {}

export interface IPlatformAccessContext {
  user: IUser | null | undefined;
  userProfilingQuestionnaireItems: IKYCSectionItemProps[];
  kycQuestionnaireItems: IKYCSectionItemProps[];
  onInvestmentProfileStartForm: (formId: string, formReferenceId: string) => void;
  onKYCStartForm: (formId: string, formReferenceId: string) => void;
  onInvestmentProfileSubmit: () => void;
  onKYCSubmit: () => void;
}

export interface IQuestionnaireItem extends IQuestionnaireItemProps {
  id: string;
  text: string;
  timeRemaining: string;
}
