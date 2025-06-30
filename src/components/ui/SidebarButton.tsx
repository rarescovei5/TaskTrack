import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

type SidebarButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({
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

export default SidebarButton;
