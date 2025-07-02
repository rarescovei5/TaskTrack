import HomeAssignedTasks from '@/components/layouts/HomeAssignedTasks';
import HomeStats from '@/components/layouts/HomeStats';
import HomeWorkspaces from '@/components/layouts/HomeWorkspaces';
import React from 'react';

const Home = () => {
  return (
    <div className="p-6 flex flex-col gap-3 h-full">
      <div className="flex flex-row items-center justify-between px-4">
        <div>
          <h5>Home</h5>
          <p className="text-foreground">Monitor all of your workspaces and tasks here</p>
        </div>
      </div>
      <hr className="border-border" />
      <HomeStats />
      <div className="flex flex-row gap-3 flex-1">
        <div className="basis-2/3 flex flex-col gap-3">
          <HomeWorkspaces className="flex-1 px-4 py-3 border border-border rounded-md flex flex-col gap-3 min-h-0" />
          <HomeAssignedTasks className="flex-1 px-4 py-3 border border-border rounded-md flex flex-col gap-3 min-h-0" />
        </div>
        <div className="basis-1/3 flex flex-col gap-3">
          <div className="basis-1/3 border border-border rounded-md"></div>
          <div className="basis-2/3 border border-border rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
