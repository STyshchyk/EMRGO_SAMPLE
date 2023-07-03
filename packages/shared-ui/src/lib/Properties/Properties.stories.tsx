import type { Meta, StoryObj } from "@storybook/react";

import { Properties } from "./Properties";
import { Property } from "./Property";
import { PropertyKey } from "./PropertyKey";
import { PropertyValue } from "./PropertyValue";

const meta: Meta<typeof Properties> = {
  title: "Properties",
  component: Properties,
};

export default meta;
type Story = StoryObj<typeof Properties>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <Property>
          <PropertyKey>Custodian</PropertyKey>
          <PropertyValue>EMERGO DIFC</PropertyValue>
        </Property>

        <Property>
          <PropertyKey>Client Name</PropertyKey>
          <PropertyValue>EFG-Hermes FI Ltd</PropertyValue>
        </Property>

        <Property>
          <PropertyKey>Client ID</PropertyKey>
          <PropertyValue>EFG</PropertyValue>
        </Property>

        <Property>
          <PropertyKey>Currency</PropertyKey>
          <PropertyValue>USD</PropertyValue>
        </Property>
      </>
    ),
  },
};
