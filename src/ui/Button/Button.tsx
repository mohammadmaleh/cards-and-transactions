import { cn } from "@/lib/utils";
import { buttonVariants } from "@/ui";
import { type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    ref?: React.Ref<HTMLButtonElement>;
  };

function Button({
  className,
  variant,
  size,
  type = "button",
  ref,
  ...props
}: ButtonProps): ReactNode {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button };
export type { ButtonProps };
