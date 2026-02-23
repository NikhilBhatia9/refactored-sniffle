import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent-blue text-white hover:bg-accent-blue/90',
        secondary: 'bg-primary-hover text-text-primary border border-primary-border hover:bg-primary-border',
        ghost: 'hover:bg-primary-hover hover:text-text-primary',
        destructive: 'bg-accent-red text-white hover:bg-accent-red/90',
        outline: 'border border-primary-border bg-transparent hover:bg-primary-hover',
        link: 'text-accent-blue underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 rounded px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
