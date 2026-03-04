import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { AppLayout } from "./AppLayout";

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    children: <p className="p-8 text-sm">Page content</p>,
  },
};
