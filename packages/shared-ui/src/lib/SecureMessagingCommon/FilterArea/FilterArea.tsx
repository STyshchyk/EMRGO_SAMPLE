import React, { FC, useRef } from "react";

import * as Styles from "./FilterArea.styles";
import { IFilterAreaProps } from "./FilterArea.types";
import { FilterToggle } from "./FilterToggle";

export const FilterArea: FC<IFilterAreaProps> = ({}) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  // const { messagesList, checked, setChecked, isCheckModeSelected, setCheckMode } = ensureNotNull(
  //   useClientSecureMessagingContext()
  // );
  //
  // useEffect(() => {
  //   if (!selectAllRef.current) return;
  //   if (checked.length === messagesList.length) {
  //     selectAllRef.current.indeterminate = false;
  //     selectAllRef.current.checked = true;
  //   } else if (checked.length > 0) {
  //     selectAllRef.current.indeterminate = true;
  //     selectAllRef.current.checked = false;
  //   }
  // }, [checked.length]);
  //
  // function selectAll() {
  //   const newChecked: string[] = [...checked];
  //   messagesList.forEach((elem) => {
  //     if (newChecked.indexOf(elem.id) === -1) newChecked.push(elem.id);
  //   });
  //   setChecked(newChecked);
  //   setCheckMode(true);
  // }
  //
  // function diSelectAll() {
  //   setChecked([]);
  //   setCheckMode(false);
  // }

  return (
    <Styles.FilterArea>
      {/*<Tooltip title={"Select All"} placement="top" aria-hidden={false}>*/}
      {/*  <Checkbox*/}
      {/*    style={{*/}
      {/*      display: isCheckModeSelected ? "inline-flex" : "none",*/}
      {/*    }}*/}
      {/*    ref={selectAllRef}*/}
      {/*    onChange={(event) => {*/}
      {/*      if (event.target.checked) selectAll();*/}
      {/*      else diSelectAll();*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Tooltip>*/}
      <div>
        <FilterToggle />

        {/*<Tooltip title={"Select"} placement="top">*/}
        {/*  <Checkbox*/}
        {/*    onChange={() => {*/}
        {/*      setCheckMode((prevState) => !prevState);*/}
        {/*      isCheckModeSelected && diSelectAll();*/}
        {/*    }}*/}
        {/*    checked={isCheckModeSelected}*/}
        {/*  />*/}
        {/*</Tooltip>*/}
      </div>
    </Styles.FilterArea>
  );
};
