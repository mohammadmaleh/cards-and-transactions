import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./Input"

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ["autodocs"],
  args: {
    id: "amount",
    label: "Amount Filter",
    placeholder: "Amount",
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue: "100",
  },
}

export const WithError: Story = {
  args: {
    defaultValue: "-5",
    errorMessage: "Amount must be a positive number",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "100",
  },
}
