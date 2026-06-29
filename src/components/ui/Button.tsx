import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "w-full h-14 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center select-none active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-[#6312e1] hover:bg-[#520cbd] text-white shadow-sm shadow-[#6312e1]/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6312e1] outline-none",
    secondary:
      "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-300 outline-none",
    outline:
      "border border-neutral-300 hover:bg-neutral-50 text-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-200 outline-none",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};
