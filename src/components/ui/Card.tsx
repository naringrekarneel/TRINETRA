import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const baseStyles =
      "rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-charcoal-900 transition-all";

    const variants = {
      default: "",
      muted:
        "bg-slate-50 border-slate-200 dark:bg-charcoal-950 dark:border-slate-800/80",
      interactive:
        "hover:border-forest-600 hover:shadow-md cursor-pointer dark:hover:border-forest-500",
    };

    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], className))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
