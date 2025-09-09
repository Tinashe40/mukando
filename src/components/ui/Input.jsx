import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  description,
  error,
  required = false,
  id,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-slate-700",
            error ? "text-red-600" : "text-slate-700"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        id={inputId}
        {...props}
      />

      {description && !error && (
        <p className="text-xs text-slate-500">
          {description}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;