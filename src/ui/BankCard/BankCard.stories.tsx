import type { Meta, StoryObj } from "@storybook/react-vite";
import { BankCard } from "./BankCard";

const meta: Meta<typeof BankCard> = {
  component: BankCard,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BankCard>;

export const PrivateCard: Story = {
  args: { type: "private" },
};

export const BusinessCard: Story = {
  args: { type: "business" },
};
