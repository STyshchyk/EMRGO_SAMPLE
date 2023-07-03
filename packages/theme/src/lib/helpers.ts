import get from "lodash/get";
import { DefaultTheme, ThemeProps } from "styled-components";

import { TPaths, TPathValue, TPathValues } from "~/types";

import { TTheme } from "./theme.types";

export const getTheme =
  <Path extends TPaths<TPathValues<TTheme>>>(path: Path) =>
  (props: ThemeProps<DefaultTheme>): TPathValue<Path, TPathValues<TTheme>> => {
    return get(props.theme, path)!;
  };
