import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Pagination } from "./Pagination"

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  argTypes: {
    onPageChange: { action: "page changed" },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
  },
}

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
  },
}

export const WithEllipsis: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
}

export const EllipsisAtEnd: Story = {
  args: {
    currentPage: 2,
    totalPages: 10,
  },
}

export const EllipsisAtStart: Story = {
  args: {
    currentPage: 9,
    totalPages: 10,
  },
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
}

function InteractivePagination() {
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Page {currentPage} of 10</p>
      <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractivePagination />,
}
