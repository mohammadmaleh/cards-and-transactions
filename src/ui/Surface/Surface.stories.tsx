import type { Meta, StoryObj } from "@storybook/react-vite"
import { Surface } from "./Surface"

const meta: Meta<typeof Surface> = {
  component: Surface,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Surface>

export const Default: Story = {
  args: {
    children: "Surface content",
  },
}

export const Selected: Story = {
  args: {
    selected: true,
    children: "Selected surface",
  },
}

export const Interactive: Story = {
  args: {
    interactive: true,
    "aria-label": "Select item",
    children: "Click me",
    onClick: () => {},
  },
}

export const InteractiveSelected: Story = {
  args: {
    interactive: true,
    selected: true,
    "aria-label": "Selected item",
    children: "Selected",
    onClick: () => {},
  },
}
