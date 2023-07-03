import type { Meta, StoryObj } from "@storybook/react";

import { CloseIcon } from "../Icon";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "IconButton",
  component: IconButton,
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    children: <CloseIcon />,
  },
};
