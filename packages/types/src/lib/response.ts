import { IDropdown } from "./dropdowns";

export interface IErrorResponse {
  logId: string;
  message: string;
}

export interface IDropdownsResponse {
  [key: string]: IDropdown[];
}
