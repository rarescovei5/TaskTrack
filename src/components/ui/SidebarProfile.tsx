import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

const SidebarProfile = () => {
  return (
    <div className="p-2 border border-border flex flex-row gap-2 rounded-md items-center relative pr-8">
      <div className="bg-border/50 rounded-sm">
        <img
          className="w-12 min-w-12"
          src="https://avatar.iran.liara.run/public/65"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <p className="truncate">Lowell J. Martinez</p>
        <small className="text-muted truncate">LowellJMartinez@rhyta.com</small>
      </div>

      <button className="cursor-pointer p-2 absolute top-1/2 -translate-y-1/2 right-0">
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
};

export default SidebarProfile;
