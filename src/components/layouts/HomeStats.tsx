import { cn } from '@/lib/utils';
import React from 'react';

type StatPropsType = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  value: any;
};
const Stat = ({ title, value, className, ...props }: StatPropsType) => {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <p className="text-muted">{title}</p>
      <h6 className={`font-medium ${value === 0 && 'text-muted'}`}>{value}</h6>
    </div>
  );
};

const HomeStats = () => {
  return (
    <div className="rounded-md border border-border px-4 py-3 flex">
      <Stat className="flex-1" title="Total Workspaces" value={2} />
      <div className="w-[1px] border border-border border-dashed mx-6" />
      <Stat className="flex-1" title="Total Tasks" value={32} />
      <div className="w-[1px] border border-border border-dashed mx-6" />
      <Stat className="flex-1" title="Assigned Tasks" value={0} />
      <div className="w-[1px] border border-border border-dashed mx-6" />
      <Stat className="flex-1" title="Completed Tasks" value={1} />
    </div>
  );
};

export default HomeStats;
