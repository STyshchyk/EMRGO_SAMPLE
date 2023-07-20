import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { IUserContext, IUserIssuance, TFilterStatus2, TFilterType2 } from "./User.types";
import { useWatchlist } from "./useWatchlist";

const issuanceMatchesSearchQuery = (issuance: IUserIssuance, query: string) => {
  return Object.values(issuance).some((value) => String(value).toLowerCase().includes(query));
};

const UserContext = createContext<IUserContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Users template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const UserProvider = ({ children }: PropsWithChildren) => {
  const [isAboutUsDisplayed, setIsAboutUsDisplayed] = useState(true);
  const { watchlist, toggleOnWatchlist } = useWatchlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TFilterType2>("all-types");
  const [filterStatus, setFilterStatus] = useState<TFilterStatus2>("all-statuses");

  // const {
  //   data: userData,
  //   isError,
  //   isFetched,
  // } = useQuery({
  //   queryFn: getUsers,
  //   queryKey: ["users", "all"],
  // });
  const downloadData = () => {
    console.log("Download data");
  };

  // TODO: For this example purposes the implementation relies on data with values
  // already formatted specifically for presentation. When integrating, make sure
  // to format the system data accordingly.

  const state: IUserContext = {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    downloadData,
    toggleIssuanceOnWatchlist: toggleOnWatchlist,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    getUsers: () => {},
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
