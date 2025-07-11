import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  asChild,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn('flex flex-row items-center gap-2 px-4 py-3 rounded-md', className)}
      {...props}
    />
  );
};

export default Button;
