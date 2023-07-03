import type { Meta, StoryObj } from "@storybook/react";

import { BreadcrumbLink } from "./BreadcrumbLink";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Primary: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbLink href="#">Trade Opportunities</BreadcrumbLink>
      <BreadcrumbLink href="#">Commerzbank</BreadcrumbLink>
      <BreadcrumbLink href="#" isCurrent>
        Issuance Name
      </BreadcrumbLink>
    </Breadcrumbs>
  ),
  args: {},
};
