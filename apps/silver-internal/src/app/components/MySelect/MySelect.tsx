import React, { useId } from "react";
import Select, { GroupBase, Props } from "react-select";
import makeAnimated from "react-select/animated";

import { IMySelectProps } from "@emrgo-frontend/shared-ui";
import { colors } from "@emrgo-frontend/theme";

import {
  MyError,
  MyErrorIcon,
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
          ...animatedComponents,
        }}
        styles={{
          menu: (styles, state) => ({
            ...styles,
            zIndex: 10,
            border: `1px solid ${colors.green3}`,
            fontSize: "0.875rem",
          }),
          menuPortal: (base, props) => ({
            ...base,
            zIndex: 9999,
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "3px",
            height: "3rem",
            fontSize: "0.875rem",
            backgroundColor: `${colors.black["5"]}`,
            border: state.isFocused
              ? `1px solid ${colors.green3}`
              : `1px solid ${colors.black["5"]}`,
            boxShadow: state.isFocused ? "none" : "none",
            "&:hover": {
              border: `1px solid ${colors.green3}`,
              boxShadow: "0px 0px 1px #11E4D9",
            },
          }),
          singleValue: (styles, state) => ({
            ...styles,
            color: state.isDisabled ? `${colors.black["100"]}` : `${colors.black["100"]}`,
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
          indicatorsContainer: (base, props) => ({
            ...base,
            transform: props.selectProps.menuIsOpen ? "rotate(182deg)" : "none",
          }),
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
