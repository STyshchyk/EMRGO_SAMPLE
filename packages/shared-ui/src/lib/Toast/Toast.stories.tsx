import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";
import { Toast } from "./Toast";
import { ToastProvider } from "./Toast.provider";
import { useToast } from "./useToast";

const meta: Meta<typeof Toast> = {
  title: "Toast",
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const SuccessToast: Story = {
  args: {
    children: "Success Message",
    variant: "success",
  },
};

export const InfoToast: Story = {
  args: {
    children: "Information Message",
    variant: "info",
  },
};

export const ErrorToast: Story = {
  args: {
    children: "Error Message",
    variant: "error",
  },
};

export const WarningToast: Story = {
  args: {
    children: "Warning Message",
    variant: "warning",
  },
};

export const ToastWithTrigger: Story = {
  render: () => {
    const { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } = useToast();

    return (
      <div style={{ display: "flex", columnGap: 8 }}>
        <Button onClick={() => showSuccessToast("Success Message")}>Show success toast</Button>
        <Button onClick={() => showInfoToast("Information Message")}>Show info toast</Button>
        <Button onClick={() => showErrorToast("Error Message")}>Show error toast</Button>
        <Button onClick={() => showWarningToast("Warning Message")}>Show warning toast</Button>
      </div>
    );
  },

  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastProvider />
      </>
    ),
  ],
};
