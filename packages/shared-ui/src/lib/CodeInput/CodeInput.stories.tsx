import type { Meta, StoryObj } from "@storybook/react";

import { CodeInput } from "./CodeInput";

const meta: Meta<typeof CodeInput> = {
  title: "CodeInput",
  component: CodeInput,
};

export default meta;
type Story = StoryObj<typeof CodeInput>;

export const Primary: Story = {
  args: { variant: "default", focus: true, label: "Enter verification code" },
};

export const DefaultVariant: Story = {
  args: {
    variant: "default",
    value: "123456",
    onChange: (value) => console.log({ value }),
    label: "Enter verification code",
  },
};

export const DefaultVariantWithError: Story = {
  args: {
    variant: "default",
    label: "Enter verification code",
    value: "123456",
    onChange: (value) => console.log({ value }),
    error: "The code was invalid",
  },
};

export const DefaultVariantWithSuccess: Story = {
  args: {
    variant: "default",
    value: "123456",
    onChange: (value) => console.log({ value }),
    success: "Verification successful",
  },
};

export const SignupVariant: Story = {
  args: {
    variant: "signup",
    label: "Enter verification code",
    value: "123456",
    onChange: (value) => console.log({ value }),
  },
};

export const SignupVariantWithError: Story = {
  args: {
    variant: "signup",
    value: "123456",
    onChange: (value) => console.log({ value }),
    error: "The code was invalid",
  },
};

export const SignupVariantWithSuccess: Story = {
  args: {
    variant: "signup",
    value: "123456",
    onChange: (value) => console.log({ value }),
    success: "Verification successful",
  },
};
