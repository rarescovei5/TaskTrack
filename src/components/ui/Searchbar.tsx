import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import React from 'react';

type SearchbarProps = React.InputHTMLAttributes<HTMLInputElement>;

const Searchbar: React.FC<SearchbarProps> = ({
  className,
  value,
  onChange,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 px-4 py-3 rounded-md border border-border',
        className
      )}
    >
      <Search size={16} className="text-foreground" />
      <input
        className="w-full outline-none typography-p placeholder:text-foreground"
        type="text"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default Searchbar;
