import "@google/model-viewer";

import { FC, useEffect, useState } from "react";

import * as Styles from "./EmrgoBackgroundAnimation.styles";
import { IEmrgoBackgroundAnimationProps } from "./EmrgoBackgroundAnimation.types";

export const EmrgoBackgroundAnimation: FC<IEmrgoBackgroundAnimationProps> = (
  props: IEmrgoBackgroundAnimationProps
) => {
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setReveal(true);
  }, []);

  return (
    <Styles.EmrgoBackgroundAnimation $reveal={reveal}>
      <model-viewer
        alt=""
        auto-rotate
        interaction-prompt-threshold="0"
        src="/images/3d-models/home.gltf"
        ar-status="not-presenting"
      ></model-viewer>
    </Styles.EmrgoBackgroundAnimation>
  );
};
