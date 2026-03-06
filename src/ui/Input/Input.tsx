import { type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  errorMessage?: string
  ref?: React.Ref<HTMLInputElement>
}

function Input({ label, errorMessage, className, id, ref, ...props }: InputProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          errorMessage && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {errorMessage && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
