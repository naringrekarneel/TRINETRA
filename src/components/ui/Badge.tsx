import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Severity } from "../../types/security";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity: Severity | "success";
}

export const Badge: React.FC<BadgeProps> = ({
  severity,
  className,
  children,
  ...props
}) => {
  const styles = {
    info: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    low: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    medium:
      "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    high: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    success:
      "bg-forest-50 text-forest-900 border-forest-200 dark:bg-forest-950/60 dark:text-forest-300 dark:border-forest-800",
  };

  const icons = {
    info: <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    low: <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    medium: (
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    ),
    high: <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    success: (
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    ),
  };

  const labels = {
    info: "Info",
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    success: "Clean Check",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
          styles[severity],
          className,
        ),
      )}
      {...props}
    >
      {icons[severity]}
      <span>{children || labels[severity]}</span>
    </span>
  );
};
