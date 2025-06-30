import HomeStats from '@/components/layouts/HomeStats';
import React from 'react';

const Home = () => {
  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between px-4">
        <div>
          <h5>Home</h5>
          <p className="text-foreground">Monitor all of your workspaces and tasks here</p>
        </div>
      </div>
      <hr className="border-border" />
      <HomeStats />
    </div>
  );
};

export default Home;
