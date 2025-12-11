import { ButtonHTMLAttributes, Children, cloneElement, isValidElement } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

const baseStyles = 'rounded-md px-4 py-2 text-sm font-medium transition';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 text-black hover:bg-emerald-400',
  secondary: 'bg-slate-800 text-white hover:bg-slate-700',
  ghost: 'bg-transparent text-white hover:bg-slate-900'
};

export const Button = ({ variant = 'primary', className, asChild, children, ...props }: ButtonProps) => {
  if (asChild) {
    const child = Children.only(children);
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...props,
        className: clsx(baseStyles, variantStyles[variant], className, child.props.className)
      });
    }
  }

  return (
    <button {...props} className={clsx(baseStyles, variantStyles[variant], className)}>
      {children}
    </button>
  );
};
