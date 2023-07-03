import { IIssuance } from "@emrgo-frontend/types";

export interface IIssuanceTableProps {
  opportunities: IIssuance[];
  onToggleIssuanceOnWatchlist?: (id: string) => void;
  onIssuanceClick?: (issuance: IIssuance, bankId: string) => void;
  bankId: string;
  searchQuery?: string;
  setSearchQuery: (query: string) => void;
  pageIndex?: number;
  pageSize?: number;
}
