import React, { useId } from "react";
import Select, { GroupBase, Props } from "react-select";
import makeAnimated from "react-select/animated";

import { colors, typography } from "@emrgo-frontend/theme";
import { ellipsis, rem } from "polished";

import * as Styles from "./MySelect.styles";
import { IMySelectProps } from "./MySelect.types";

export const MySelect = <
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  error,
  maxWidth,
  ...props
}: Props<OptionType, IsMulti, GroupType> & IMySelectProps) => {
  const animatedComponents = makeAnimated();
  const isDarkMode = false;
  const componentId = useId();
  const idValue = props.id ?? componentId;

  const getOptionStyles = (type: string, state: any, error?: string | boolean) => {
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
            ? `linear-gradient( 0deg, rgba(255,66,66,0.05), rgba(255,66,66,0.05) ), #FFFFFF`
            : isDarkMode
            ? colors.green3
            : colors.black[5],
        };
        break;
      case "controlBorder":
        styles = {
          border: error
            ? `1px solid ${colors.red}`
            : state.isFocused
            ? `1px solid ${colors.green3}`
            : `1px solid ${colors.strokes.light}`,
        };
        break;
      case "controlHover":
        styles = {
          border: error ? `1px solid ${colors.red}` : `1px solid ${colors.green3}`,
          boxShadow: error ? `0px 0px 1px ${colors.red}` : `0px 0px 1px ${colors.green3}`,
        };
        break;
      default:
        break;
    }

    return styles;
  };

  return (
    <Styles.MySelect $maxWidth={maxWidth}>
      <Select
        {...props}
        id={idValue}
        name={idValue}
        // blurInputOnSelect // Removes focus after user select option. This to remove error icon if exists
        components={{
          ...animatedComponents,
        }}
        styles={{
          menu: (styles, state) => ({
            ...styles,
            zIndex: 10,
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: isDarkMode ? colors.green3 : colors.green3,
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
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: "3rem",
            ...getOptionStyles("controlBorder", state, error),
            "&:hover": {
              ...getOptionStyles("controlHover", state, error),
            },
            display: "flex",
            alignItems: "center",
            width: "100%",
            columnGap: rem(8),
            ...getOptionStyles("controlBackground", state, error),
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: rem(4),
            padding: `${rem(2)} ${rem(4)}`,
            borderColor: isDarkMode
              ? state.menuIsOpen
                ? colors.green3
                : colors.strokes.dark
              : state.menuIsOpen
              ? colors.green3
              : colors.strokes.light,
            boxShadow: "none",
          }),
          singleValue: (styles, state) => ({
            ...styles,
            color: error ? colors.red : colors.black[100],
            ...ellipsis(),
            ...typography.regular["02Tight"],
          }),
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
              color: error ? colors.red : colors.black[60],
              ...ellipsis(),
              ...typography.medium["02Tight"],
            };
          },
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
          indicatorsContainer: (base, props) => ({
            ...base,
            transform: props.selectProps.menuIsOpen ? "rotate(182deg)" : "none",
            svg: error ? { fill: "red" } : "none",
          }),
        }}
      />
      {!!error && (
        <Styles.Error>
          <Styles.ErrorIcon />
          <span>{error}</span>
        </Styles.Error>
      )}
    </Styles.MySelect>
  );
};
