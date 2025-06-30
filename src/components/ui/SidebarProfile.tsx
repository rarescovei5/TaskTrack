import { ChevronsUpDown } from 'lucide-react';
import React from 'react';

const SidebarProfile = () => {
  return (
    <div className="p-2 border border-border flex flex-row gap-2 rounded-md items-center relative">
      <div className="bg-border/50 rounded-sm">
        <img className="w-12" src="https://avatar.iran.liara.run/public/65" alt="" />
      </div>
      <div className="flex flex-col gap-1">
        <p>Lowell J. Martinez</p>
        <small className="text-muted">LowellJMartinez@rhyta.com</small>
      </div>

      <button className="cursor-pointer p-2 absolute top-1/2 -translate-y-1/2 right-0">
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
};

export default SidebarProfile;
