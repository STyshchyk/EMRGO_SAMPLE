import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    label: "email address",
  },
};

export const InputWithValue: Story = {
  args: {
    ...Primary.args,
    value: "ryancollins@elefant.capital",
  },
};

export const ValidInput: Story = {
  args: {
    ...Primary.args,
    value: "ryancollins@elefant.capital",
    valid: true,
  },
};

export const InputWithHelper: Story = {
  args: {
    ...Primary.args,
    value: "ryancollins@elefant.capital",
    helperText: "Helper text",
  },
};

export const InvalidInput: Story = {
  args: {
    ...Primary.args,
    error: "Invalid email address",
    value: "ryancollins@elefant.capital",
  },
};

export const DisabledInput: Story = {
  args: {
    ...Primary.args,
    value: "ryancollins@elefant.capital",
    disabled: true,
  },
};
