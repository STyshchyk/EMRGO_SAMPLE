import { useLayoutEffect, useState } from "react";

import Swiper from "swiper";
import { useSwiper } from "swiper/react";

const getProgressLeftInPercentage = (currentProgressInPercentage: number) => {
  return Math.round((1 - currentProgressInPercentage) * 100);
};

export const useSwiperPagination = () => {
  const swiper = useSwiper();
  const [slides, setSlides] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayProgress, setAutoplayProgress] = useState(0);

  useLayoutEffect(() => {
    const onInit = () => {
      setSlides(swiper.slides);
    };

    const onActiveIndexChange = () => {
      setActiveIndex(swiper.activeIndex);

      if (swiper.autoplay.running) {
        setAutoplayProgress(0);
      }
    };

    const onAutoplayTimeLeft = (_swiper: Swiper, _timeLeft: number, percentage: number) => {
      setAutoplayProgress(getProgressLeftInPercentage(percentage));
    };

    const onAutoplayStop = () => {
      setAutoplayProgress(100);
    };

    swiper.on("init", onInit);
    swiper.on("activeIndexChange", onActiveIndexChange);
    swiper.on("autoplayTimeLeft", onAutoplayTimeLeft);
    swiper.on("autoplayStop", onAutoplayStop);

    return () => {
      swiper.off("navigationShow", onInit);
      swiper.off("activeIndexChange", onActiveIndexChange);
      swiper.off("autoplayTimeLeft", onAutoplayTimeLeft);
      swiper.off("autoplayStop", onAutoplayStop);
    };
  }, [swiper]);

  const isActiveSlide = (index: number) => {
    return activeIndex === index;
  };

  const isPreviousSlide = (index: number) => {
    return index < activeIndex;
  };

  return {
    slides,
    slideTo: swiper.slideTo.bind(swiper),
    isActiveSlide,
    isPreviousSlide,
    autoplayProgress,
  };
};
