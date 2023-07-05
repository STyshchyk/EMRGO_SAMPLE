export interface IManageIssuersProps {
}

export interface IManageIssuersContext {
}

export interface ILifecycle {
  preOfferPeriod: string;
  offerPeriodEnds: string;
  issueDate: string;
  redemptionDate: string;
}

export interface IIssuer {
  id?: string;
  name: string;
  jurisdiction: string;
  description: string;
  isShown?: string;
}
