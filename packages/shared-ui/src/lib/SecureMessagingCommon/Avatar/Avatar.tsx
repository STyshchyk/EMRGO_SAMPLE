import React, { FC } from "react";

import * as Styles from "./Avatar.styles";
import { IAvatar } from "./Avatar.types";

export const AvatarIcon: FC<IAvatar> = ({ initials, width, fontSize }) => {
  return (
    <Styles.AvatarIcon width={width} fontSize={fontSize}>
      {initials
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </Styles.AvatarIcon>
  );
};
