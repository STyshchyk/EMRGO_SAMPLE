export interface ITradeInterestModal {}


export interface ITradeInterest{
  detail: string,
  opportunityId: string,
  status: "assigned" | "un_assigned",
  userId: string
}
