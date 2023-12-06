import { FC } from "react";

import { ReactComponent as Emrgo } from "./Emrgo.svg";
import * as Styles from "./Logo.styles";
import { ILogoProps } from "./Logo.types";

export const Logo: FC<ILogoProps> = (props: ILogoProps) => {
  return (
    <Styles.Logo $isHidden={props.isHidden}>
      <Emrgo key={"Emrgo"} />
    </Styles.Logo>
  );
};
