import { FC } from "react";

import * as Styles from "./BannerPagination.styles";
import { IBannerPaginationProps } from "./BannerPagination.types";
import { useSwiperPagination } from "./useSwiperPagination";

export const BannerPagination: FC<IBannerPaginationProps> = ({}: IBannerPaginationProps) => {
  const { slides, slideTo, isPreviousSlide, autoplayProgress, isActiveSlide } =
    useSwiperPagination();

  return (
    <Styles.BannerPagination>
      {slides.map((_, index) => (
        <li key={index}>
          <Styles.PageButton
            onClick={() => slideTo(index)}
            $isPrevious={isPreviousSlide(index)}
            aria-label={`Slide ${index + 1}`}
            aria-current={isActiveSlide(index)}
          >
            {isActiveSlide(index) && (
              <Styles.AutoPlayProgress style={{ width: `${autoplayProgress}%` }} />
            )}
          </Styles.PageButton>
        </li>
      ))}
    </Styles.BannerPagination>
  );
};
