import type { Meta, StoryObj } from "@storybook/react-vite"
import { BankCard } from "./BankCard"

const meta: Meta<typeof BankCard> = {
  component: BankCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "Private Card",
    cardId: "lkmfkl-mlfkm-dlkfm",
    onSelect: () => {},
  },
}

export default meta
type Story = StoryObj<typeof BankCard>

export const Default: Story = {
  args: {
    selected: false,
  },
}

export const Selected: Story = {
  args: {
    selected: true,
  },
}

export const BusinessCard: Story = {
  args: {
    name: "Business Card",
    cardId: "elek-n3lk-4m3lk4",
    selected: false,
  },
}
