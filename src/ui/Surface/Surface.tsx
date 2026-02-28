import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type SurfaceBaseProps = {
  selected?: boolean
  ref?: React.Ref<HTMLDivElement>
}

type InteractiveSurfaceProps = SurfaceBaseProps & {
  interactive: true
  onClick: React.MouseEventHandler<HTMLButtonElement>
  ref?: React.Ref<HTMLButtonElement>
} & Omit<HTMLAttributes<HTMLButtonElement>, "onClick">

type StaticSurfaceProps = SurfaceBaseProps & {
  interactive?: false
} & HTMLAttributes<HTMLDivElement>

type SurfaceProps = InteractiveSurfaceProps | StaticSurfaceProps

const surfaceClasses = (selected: boolean | undefined, className: string | undefined) =>
  cn(
    "rounded-xl p-5 transition-colors",
    selected
      ? "bg-sky-100 ring-2 ring-sky-300"
      : "bg-muted",
    className
  )

function Surface(props: SurfaceProps) {
  if (props.interactive) {
    const { selected, className, onClick, ref, interactive: _interactive, ...rest } = props
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          surfaceClasses(selected, className),
          "cursor-pointer text-left",
          "hover:brightness-95 active:brightness-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      />
    )
  }

  const { selected, className, ref, ...rest } = props
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={surfaceClasses(selected, className)}
      {...rest}
    />
  )
}

export { Surface }
export type { SurfaceProps }
