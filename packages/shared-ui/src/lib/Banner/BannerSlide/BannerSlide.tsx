import { FC } from "react";

import * as Styles from "./BannerSlide.styles";
import { IBannerSlideProps } from "./BannerSlide.types";

export const BannerSlide: FC<IBannerSlideProps> = (props) => {
  return <Styles.Slide {...props} />;
};

BannerSlide.displayName = "BannerSlideSwiperSlide";
