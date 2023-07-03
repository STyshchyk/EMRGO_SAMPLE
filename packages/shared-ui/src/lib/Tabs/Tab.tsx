import { ComponentType } from "react";

import * as Styles from "./Tab.styles";
import { TTabProps } from "./Tab.types";
import { useTabs } from "./Tabs.context";

export const Tab = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AsComponent extends JSX.IntrinsicElements | ComponentType<any> | undefined = undefined
>({
  children,
  value,
  ...tabProps
}: TTabProps<AsComponent>) => {
  const { tab, setTab } = useTabs();
  const isActive = tab === value;

  return (
    <Styles.Tab
      role="tab"
      aria-selected={isActive}
      onClick={() => setTab(value)}
      $isActive={isActive}
      {...tabProps}
    >
      <Styles.Content>{children}</Styles.Content>

      {/* Because text in tabs becomes bold when active, it increases overall width
      of the component and shifts other tabs next to it. This sizer component is a
      small hack that renders the same content as the tab itself, but in bold weight,
      which forces the tab to be the same width for both states, active and not active*/}
      <Styles.ContentSizer>{children}</Styles.ContentSizer>
    </Styles.Tab>
  );
};
