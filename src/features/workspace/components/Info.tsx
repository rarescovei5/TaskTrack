import { Settings } from 'lucide-react';
import React from 'react';

const Info = ({ title, description }: { title: string; description: string | null }) => {
  return (
    <div className="flex justify-between px-4 py-3">
      <div className="flex flex-col gap-2">
        <h5>{title}</h5>
        <p className="text-muted">{description || 'No Description'}</p>
      </div>
      <div>
        <button className="flex gap-3 px-4 py-3 items-center border border-border rounded-md cursor-pointer hover:bg-muted/4 active:bg-muted/2">
          <Settings size={16} /> Settings
        </button>
      </div>
    </div>
  );
};

export default Info;
