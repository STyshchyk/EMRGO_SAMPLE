import "@google/model-viewer";

import { FC } from "react";

import * as Styles from "./BackgroundImage.styles";
import { IBackgroundImageProps } from "./BackgroundImage.types";

export const BackgroundImage: FC<IBackgroundImageProps> = (props: IBackgroundImageProps) => {
  return (
    <Styles.BackgroundImage>
      <model-viewer
        alt=""
        auto-rotate
        interaction-prompt-threshold="0"
        src="/images/3d-models/home.gltf"
        ar-status="not-presenting"
        style={{ transform: "translate(0px, 0px)" }}
        data-loaded
      ></model-viewer>
    </Styles.BackgroundImage>
  );
};
