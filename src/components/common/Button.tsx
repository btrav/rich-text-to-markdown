import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  isActive = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100'
  };
  
  // Mobile sizes hit a 44px touch target (iOS HIG); desktop drops back to compact.
  const sizes = {
    sm: 'h-11 min-w-11 px-3 text-sm lg:h-8 lg:min-w-0 lg:text-xs',
    md: 'h-11 min-w-11 px-4 py-2 lg:h-9',
    lg: 'h-11 min-w-11 px-5 py-2 lg:h-10'
  };
  
  const activeStyles = isActive
    ? 'bg-slate-200 dark:bg-slate-600'
    : '';
  
  return (
    <button
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        activeStyles,
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;