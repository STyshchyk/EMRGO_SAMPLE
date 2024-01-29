import * as React from "react";
import { FC } from "react";

import noop from "lodash/noop";

import { ExpandArrow } from "../ExpandArrow";
import { TabsContext } from "./Tabs.context";
import * as Styles from "./Tabs.styles";
import { ITabsProps } from "./Tabs.types";

export const Tabs: FC<ITabsProps> = ({ children, value, onChange }: ITabsProps) => {
  const providerValue = {
    tab: value,
    setTab: onChange ?? noop,
  };

  return (
    <div className={"relative"}>
      <ExpandArrow />
      <TabsContext.Provider value={providerValue}>
        <Styles.Tabs role="tablist">{children}</Styles.Tabs>
      </TabsContext.Provider>
    </div>
  );
};
