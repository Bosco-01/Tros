import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, rightElement, className = "", type = "text", ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-neutral-900 tracking-tight">
          {label}
        </label>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type={type}
            className={`w-full h-14 px-5 bg-white border border-neutral-300 rounded-[14px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#6312e1] focus:ring-1 focus:ring-[#6312e1] transition-all duration-200 ${
              rightElement ? "pr-12" : ""
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
