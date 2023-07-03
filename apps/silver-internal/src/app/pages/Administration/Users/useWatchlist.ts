import { useState } from "react";

import xor from "lodash/xor";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const toggleOnWatchlist = (id: number, flag?:  boolean) => {
    setWatchlist((watchlist) => xor(watchlist, [id]));
  };

  return { watchlist, toggleOnWatchlist };
};
