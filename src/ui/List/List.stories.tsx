import type { Meta, StoryObj } from "@storybook/react-vite"
import { List, ListItem } from "./List"

const meta: Meta<typeof List> = {
  component: List,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof List>

export const Default: Story = {
  render: () => (
    <List aria-label="Transactions">
      <ListItem>Food — -€123,88</ListItem>
      <ListItem>Snack — -€33,48</ListItem>
      <ListItem>Tickets — -€288,38</ListItem>
    </List>
  ),
}

export const SingleItem: Story = {
  render: () => (
    <List aria-label="Transactions">
      <ListItem>Food — -€123,88</ListItem>
    </List>
  ),
}

export const Empty: Story = {
  render: () => <List aria-label="Transactions" />,
}
