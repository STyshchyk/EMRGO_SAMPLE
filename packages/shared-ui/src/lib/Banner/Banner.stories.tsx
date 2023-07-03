import type { Meta, StoryObj } from "@storybook/react";

import { Banner } from "./Banner";
import { BannerSlide, BannerSlideDescription, BannerSlideTitle } from "./BannerSlide";

const meta: Meta<typeof Banner> = {
  title: "Banner",
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const BannerWithSlides: Story = {
  args: {
    children: (
      <>
        <BannerSlide>
          <BannerSlideTitle>Slide one title</BannerSlideTitle>
          <BannerSlideDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non hendrerit ligula.
          </BannerSlideDescription>
        </BannerSlide>
        <BannerSlide>
          <BannerSlideTitle>Slide two title</BannerSlideTitle>
          <BannerSlideDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non hendrerit ligula.
          </BannerSlideDescription>
        </BannerSlide>
        <BannerSlide>
          <BannerSlideTitle>Slide three title</BannerSlideTitle>
          <BannerSlideDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non hendrerit ligula.
          </BannerSlideDescription>
        </BannerSlide>
      </>
    ),
  },
};
