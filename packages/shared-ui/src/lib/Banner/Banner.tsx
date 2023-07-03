import "swiper/css";

import { FC } from "react";

import { Autoplay } from "swiper";
import { Swiper } from "swiper/react";

import * as Styles from "./Banner.styles";
import { IBannerProps } from "./Banner.types";
import { BannerPagination } from "./BannerPagination";

export const Banner: FC<IBannerProps> = ({ children, ...swiperProps }: IBannerProps) => {
  return (
    <Styles.Container>
      <Swiper autoplay {...swiperProps} modules={[Autoplay]}>
        {children}
        <BannerPagination />
      </Swiper>
    </Styles.Container>
  );
};
