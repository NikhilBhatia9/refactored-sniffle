import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
        green: 'bg-accent-green/20 text-accent-green border border-accent-green/30',
        red: 'bg-accent-red/20 text-accent-red border border-accent-red/30',
        yellow: 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30',
        secondary: 'bg-primary-hover text-text-secondary border border-primary-border',
        outline: 'border border-primary-border text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
