import React from "react";
import ReactSelect, { GroupBase, Props } from "react-select";
import makeAnimated from "react-select/animated";

import { colors, typography } from "@emrgo-frontend/theme";
import { ellipsis, rem } from "polished";
import { useDarkMode } from "usehooks-ts";

import { ISelectProps } from "./Select.types";

// import * as Styles from "./Select.styles";

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ components: customComponent, ...props }: Props<Option, IsMulti, Group> & ISelectProps) {
  const animatedComponents = makeAnimated();
  const { isDarkMode } = useDarkMode();
  
  const getOptionStyles = (type: string, state: any) => {
    let styles = {};

    switch (type) {
      case "hover":
        styles = {
          backgroundColor: isDarkMode ? colors.white[5] : colors.black[5],
        };
        break;
      case "select":
        styles = {
          backgroundColor: isDarkMode
            ? state.isSelected
              ? colors.dark
              : "transparent"
            : state.isSelected
            ? colors.black[20]
            : "transparent",
        };
        break;

      default:
        break;
    }

    return styles;
  };

  // Create an object that merges customComponent and animatedComponents
  const mergedComponents = {
    ...animatedComponents,
    ...(customComponent || {}), // Use customComponent if available
  };

  return (
    <ReactSelect
      {...props}
      components={mergedComponents}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          display: "flex",
          alignItems: "center",
          width: "100%",
          columnGap: rem(8),
          backgroundColor: isDarkMode ? colors.green1 : colors.white[100],
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: rem(4),
          padding: `${rem(1)} ${rem(4)}`,
          borderColor: isDarkMode
            ? state.menuIsOpen
              ? colors.green5
              : colors.strokes.dark
            : state.menuIsOpen
            ? colors.green3
            : colors.strokes.light,
          boxShadow: "none",
        }),
        menu: (styles, state) => ({
          ...styles,
          zIndex: 15,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: isDarkMode ? colors.green5 : colors.green3,
          backgroundColor: isDarkMode ? colors.green1 : colors.white[100],
        }),
        menuPortal: (base, props) => ({
          ...base,
          zIndex: 9999,
        }),
        option: (styles, state) => ({
          ...styles,
          ...typography.medium["02"],
          ...getOptionStyles("select", state),
          color: isDarkMode ? colors.white[60] : colors.black[60],
          "&:hover": {
            ...getOptionStyles("hover", state),
          },
        }),
        singleValue: (styles, state) => ({
          ...styles,
          color: isDarkMode ? colors.white[60] : colors.black[60],
          ...ellipsis(),
          ...typography.medium["02"],
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
  );
}
