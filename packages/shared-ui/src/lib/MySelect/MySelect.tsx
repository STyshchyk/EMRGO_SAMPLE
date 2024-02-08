import React, { useContext, useId } from "react";
import Select, { GroupBase, Props } from "react-select";

import { colors, typography } from "@emrgo-frontend/theme";
import { FormikContext } from "formik";
import { ellipsis, rem, rgba } from "polished";
import { useDarkMode } from "usehooks-ts";

import * as Styles from "./MySelect.styles";
import { IMySelectProps } from "./MySelect.types";

export const MySelect = <
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  error: customError,
  maxWidth,
  border,
  components: customComponent,
  variant = "signup",
  ...props
}: Props<OptionType, IsMulti, GroupType> & IMySelectProps) => {
  const formik = useContext(FormikContext);
  const formikError =
    formik?.touched[`${props?.id}`] && (formik?.errors[`${props?.id}`] as string | undefined);
  const error = customError ? customError : formikError;
  const animatedComponents = {};
  const { isDarkMode } = useDarkMode();
  const componentId = useId();
  const idValue = props.id ?? componentId;
  const SignUpVariant = variant === "signup";

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
              : `linear-gradient( 0deg, rgba(255,100,3,0.05), rgba(255,100,3,0.05) ), rgba(255,255,255,0.1)`
            : isDarkMode
            ? SignUpVariant
              ? colors.white[0]
              : rgba(255, 255, 255, 0.05)
            : SignUpVariant
            ? colors.white[100]
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
    <Styles.MySelect $maxWidth={maxWidth}>
      <Select
        {...props}
        id={idValue}
        name={idValue}
        // blurInputOnSelect // Removes focus after user select option. This to remove error icon if exists
        components={{
          ...mergedComponents,
        }}
        styles={{
          menu: (styles, state) => ({
            ...styles,
            zIndex: 9999,
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
            display: "flex",
            justifyContent: "space-between",
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            minHeight: "3rem",
            ...getOptionStyles("controlBorder", state, error),
            "&:hover": {
              ...getOptionStyles("controlHover", state, error),
            },
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
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
            border: border ? "1px solid transparent" : "",
            boxShadow: "none",
          }),
          singleValue: (styles, state) => ({
            ...styles,
            color: error
              ? isDarkMode
                ? colors.orange
                : colors.red
              : isDarkMode
              ? colors.white[60]
              : colors.black[60],
            ...ellipsis(),
            ...typography.regular["02Tight"],
          }),
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
              ...getOptionStyles("placeholderColor", null, error),
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
            svg: error ? { fill: isDarkMode ? `${colors.orange}` : `${colors.red}` } : "none",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? `${colors.green5}` : `${colors.green2}`,
            svg: { fill: `${colors.red}` },
            borderRadius: "5px",
          }),
          valueContainer: (styles, state) => ({
            ...styles,
            gap: state.isMulti ? "5px" : "",
          }),
          multiValueLabel: (base) => ({
            ...base,
            ...typography.medium["02Tight"],
            color: isDarkMode ? `${colors.black["90"]}` : `${colors.white["100"]}`,
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
