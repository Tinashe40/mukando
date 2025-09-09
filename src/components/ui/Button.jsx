import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import React from 'react';
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg",
        destructive: "bg-gradient-to-r from-rose-600 to-red-700 text-white hover:from-rose-700 hover:to-red-800 shadow-md hover:shadow-lg",
        outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        secondary: "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg",
        warning: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-md hover:shadow-lg",
        premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xs: "h-8 rounded-lg px-2 text-xs",
        xl: "h-12 rounded-lg px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  children,
  loading = false,
  iconName = null,
  iconPosition = 'left',
  iconSize = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";

  // Icon size mapping based on button size
  const iconSizeMap = {
    xs: 12,
    sm: 14,
    default: 16,
    lg: 18,
    xl: 20,
    icon: 16,
  };

  const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin h-4 w-4 mr-2" 
        viewBox="0 0 24 24"
        aria-hidden="true"
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
      <span>Loading...</span>
    </div>
  );

  const renderIcon = () => {
    if (!iconName || loading){
      return null;
    }
    return (
      <Icon
        name={iconName}
        size={calculatedIconSize}
        className={cn(
          "flex-shrink-0 transition-transform duration-200",
          children && iconPosition === 'left' && "mr-2",
          children && iconPosition === 'right' && "ml-2"
        )}
        aria-hidden="true"
      />
    );
  };

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        loading && "opacity-75 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {iconName && iconPosition === 'left' && renderIcon()}
          {children}
          {iconName && iconPosition === 'right' && renderIcon()}
        </>
      )}
    </Comp>
  );
});

Button.displayName = "Button";

export default Button;