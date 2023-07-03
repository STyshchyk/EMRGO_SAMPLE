import { FC } from "react";

import noop from "lodash/noop";

import { TabsContext } from "./Tabs.context";
import * as Styles from "./Tabs.styles";
import { ITabsProps } from "./Tabs.types";

export const Tabs: FC<ITabsProps> = ({ children, value, onChange }: ITabsProps) => {
  const providerValue = {
    tab: value,
    setTab: onChange ?? noop,
  };

  return (
    <TabsContext.Provider value={providerValue}>
      <Styles.Tabs role="tablist">{children}</Styles.Tabs>
    </TabsContext.Provider>
  );
};
