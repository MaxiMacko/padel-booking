import { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Role",
    options: [
      { value: "CLIENT", label: "Client" },
      { value: "TRAINER", label: "Trainer" },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: "Role",
    options: [
      { value: "CLIENT", label: "Client" },
      { value: "TRAINER", label: "Trainer" },
    ],
    error: "Role is required",
  },
};
