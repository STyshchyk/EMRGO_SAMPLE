import React from "react";
import ReactSelect, { GroupBase, Props } from "react-select";

import { colors, typography } from "@emrgo-frontend/theme";
import { ellipsis, rem, rgba } from "polished";
import { useDarkMode } from "usehooks-ts";

import { ISelectProps } from "./Select.types";

// import * as Styles from "./Select.styles";

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ components: customComponent, ...props }: Props<Option, IsMulti, Group> & ISelectProps) {
  const animatedComponents = {}; //to prevent flickering when using select in modals
  const { isDarkMode } = useDarkMode();

  const getOptionStyles = (type: string, state?: any, error?: string | boolean) => {
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
      case "controlBackground":
        styles = {
          background: error
            ? isDarkMode
              ? `linear-gradient( 0deg, rgba(255,100,3,0.05), rgba(255,100,3,0.05) ), rgba(255,255,255,0.1)`
              : `linear-gradient( 0deg, rgba(255,66,66,0.05), rgba(255,66,66,0.05) ),  #FFFFFF`
            : isDarkMode
            ? rgba(255, 255, 255, 0.05)
            : colors.black[5],
        };
        break;
      case "placeholderColor":
        styles = {
          color: error
            ? isDarkMode
              ? colors.orange
              : colors.red
            : isDarkMode
            ? colors.white[60]
            : colors.black[60],
        };
        break;
      case "controlBorder":
        styles = {
          border: error
            ? isDarkMode
              ? `1px solid ${colors.orange}`
              : `1px solid ${colors.red}`
            : state.isFocused
            ? isDarkMode
              ? `1px solid ${colors.green5}`
              : `1px solid ${colors.green3}`
            : isDarkMode
            ? `1px solid ${colors.strokes.dark}`
            : `1px solid ${colors.strokes.light}`,
        };
        break;
      case "controlHover":
        styles = {
          border: error
            ? isDarkMode
              ? `1px solid ${colors.orange}`
              : `1px solid ${colors.red}`
            : `1px solid ${colors.green3}`,
          boxShadow: error
            ? isDarkMode
              ? `0px 0px 1px ${colors.orange}`
              : `0px 0px 1px ${colors.red}`
            : `0px 0px 1px ${colors.green3}`,
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
          fontFamily: 'Inter, "Roboto","Helvetica","Arial",sans-serif',
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
          ...typography.regular["01"],
          ...getOptionStyles("select", state),
          color: isDarkMode ? colors.white[60] : colors.black[90],
          "&:hover": {
            ...getOptionStyles("hover", state),
          },
        }),
        singleValue: (styles, state) => ({
          ...styles,
          color: isDarkMode ? colors.white[60] : colors.black[90],
          ...ellipsis(),
          ...typography.regular["01"],
        }),
        valueContainer: (styles, state) => ({
          ...styles,
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
