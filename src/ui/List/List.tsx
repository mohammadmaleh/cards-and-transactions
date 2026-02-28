import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ListProps = HTMLAttributes<HTMLUListElement> & {
  ref?: React.Ref<HTMLUListElement>
}

type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  ref?: React.Ref<HTMLLIElement>
}

function List({ className, ref, ...props }: ListProps) {
  return (
    <ul
      ref={ref}
      className={cn("m-0 flex list-none flex-col gap-3 p-0", className)}
      {...props}
    />
  )
}

function ListItem({ ref, ...props }: ListItemProps) {
  return <li ref={ref} {...props} />
}

export { List, ListItem }
export type { ListProps, ListItemProps }
