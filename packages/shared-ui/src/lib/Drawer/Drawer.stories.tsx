import type { Meta, StoryObj } from "@storybook/react";

import { Drawer } from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Drawer",
  component: Drawer,
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = {
  args: {
    children: "Drawer",
  },
};
