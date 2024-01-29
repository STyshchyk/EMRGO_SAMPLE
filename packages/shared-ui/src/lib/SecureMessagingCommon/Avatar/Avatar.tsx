import React, { FC } from "react";

import * as Styles from "./Avatar.styles";
import { IAvatar } from "./Avatar.types";

export const AvatarIcon: FC<IAvatar> = ({ initials, width, fontSize }) => {
  const firstChar = Array.from([initials?.firstName, initials?.lastName])
    .map((n) => n[0].toUpperCase())
    .join("");
  return (
    <Styles.AvatarIcon width={width} fontSize={fontSize}>
      {firstChar}
    </Styles.AvatarIcon>
  );
};
