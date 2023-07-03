import React, { useId } from "react";
import Select, { GroupBase, Props } from "react-select";
import makeAnimated from "react-select/animated";

import { IMySelectProps } from "@emrgo-frontend/shared-ui";

import {
  MyError,
  MyErrorIcon
} from "../../pages/Primaries/TradeOpportunities/AddOpportunityModal/AddOpportunity.styles";
import * as Styles from "./MySelect.styles";

export const MySelect = <
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
    error,
    ...props
  }: Props<OptionType, IsMulti, GroupType> & IMySelectProps) => {
  const animatedComponents = makeAnimated();
  const componentId = useId();
  const idValue = props.id ?? componentId;
  return (
    <Styles.MySelect>
      <Select
        {...props}
        id={idValue}
        name={idValue}
        components={{
          ...animatedComponents
        }}
        styles={{
          menu: (styles, state) => ({
            ...styles,
            zIndex: 10,
            border: "1px solid #11E4D9"
          }),
          menuPortal: (base, props) => ({
            ...base,
            zIndex: 9999
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "3px",
            height: "3rem",
            backgroundColor: "white",
            border: state.isFocused ? "1px solid #11E4D9" : "1px solid #E8E8E9",
            boxShadow: state.isFocused ? "none" : "none",
            "&:hover": {
              border: "1px solid #11E4D9",
              boxShadow: "0px 0px 1px #11E4D9"
            }
          }),
          singleValue: (styles, state) => ({
            ...styles,
            color: state.isDisabled ? "rgb(28, 27, 31)" : "rgb(28, 27, 31)"
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none"
          }),
          indicatorsContainer: (base, props) => ({
            ...base,
            transform: props.selectProps.menuIsOpen ? "rotate(182deg)" : "none"
          })
        }}
      />
      {!!error && (
        <MyError>
          <MyErrorIcon />
          <span>{error}</span>
        </MyError>
      )}
    </Styles.MySelect>
  );
};


