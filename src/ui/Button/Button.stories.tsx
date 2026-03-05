import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    size: "icon",
    "aria-label": "View details",
    children: <Eye size={16} />,
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};

export const IconDisabled: Story = {
  args: {
    variant: "ghost",
    size: "icon",
    "aria-label": "View details",
    disabled: true,
    children: <Eye size={16} />,
  },
};
