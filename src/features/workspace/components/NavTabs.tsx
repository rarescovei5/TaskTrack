import React from 'react';
import { Calendar, Kanban, Table } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NavTabs = ({ basePath }: { basePath: string }) => {
  const tabs = [
    { to: `${basePath}/board`, Icon: Kanban, label: 'Board' },
    { to: `${basePath}/table`, Icon: Table, label: 'Table' },
    {
      to: `${basePath}/calendar`,
      Icon: Calendar,
      label: 'Calendar',
    },
  ];
  return (
    <div className="flex items-center relative">
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          replace
          className={({ isActive }) => `
                    px-4 py-3 flex gap-2 items-center transition-colors duration-300 relative
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-[2px] after:bg-primary
                    after:origin-center after:transition-transform after:duration-300
                    ${
                      isActive
                        ? 'text-primary after:scale-x-100'
                        : 'text-muted after:scale-x-0'
                    }
                `}
        >
          <Icon size={16} />
          <p>{label}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default React.memo(NavTabs);
