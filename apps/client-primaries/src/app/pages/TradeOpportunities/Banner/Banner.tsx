import { FC } from "react";

import {
  Banner as BannerComponent,
  BannerSlide,
  BannerSlideDescription,
  BannerSlideTitle,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useTradeOpportunitiesContext } from "../TradeOpportunities.provider";
import { IBannerProps } from "./Banner.types";

export const Banner: FC<IBannerProps> = ({}) => {
  const { slides } = ensureNotNull(useTradeOpportunitiesContext());

  return (
    <BannerComponent>
      {slides.map((slide, index) => (
        <BannerSlide key={index}>
          <BannerSlideTitle>{slide.title}</BannerSlideTitle>
          <BannerSlideDescription>{slide.description}</BannerSlideDescription>
        </BannerSlide>
      ))}
    </BannerComponent>
  );
};
