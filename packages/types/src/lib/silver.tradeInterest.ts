export interface ITradeInterestPayload{
  detail: string,
  opportunityId: string,
  status: "assigned" | "un_assigned",
  userId: string
}

export interface ITradeInterestFetch{
  id:string,
  firstName: string,
  lastName: string,
  email: string,
  detail: string,
}
