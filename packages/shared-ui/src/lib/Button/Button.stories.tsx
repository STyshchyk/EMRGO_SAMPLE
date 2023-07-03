import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const LargePrimaryButton: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "large",
  },
};

export const LargeSecondaryButton: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "large",
  },
};

export const MediumPrimaryButton: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "medium",
  },
};

export const MediumSecondaryButton: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "medium",
  },
};

export const SmallPrimaryButton: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "small",
  },
};

export const SmallSecondaryButton: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "small",
  },
};

export const DisabledSmallPrimaryButton: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "small",
    disabled: true,
  },
};

export const DisabledSmallSecondaryButton: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "small",
    disabled: true,
  },
};

export const ErrorPrimaryButton: Story = {
  args: {
    children: "Error Button",
    variant: "primary",
    color: "error",
  },
};

export const ErrorSecondaryButton: Story = {
  args: {
    children: "Error Button",
    variant: "secondary",
    color: "error",
  },
};
