import { useSelector } from 'react-redux';
import Navbar from '../layout/Navbar';
import { RootState } from '../app/store';
import Sidebar from '../layout/Dashboard/Sidebar';
import Content from '../layout/Dashboard/Content';
import { useState } from 'react';

const Dashboard = () => {
  const appSettings = useSelector((state: RootState) => state.settings);
  const [selectedMenu, setSelectedMenu] = useState(-1);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {!appSettings.isCollapsed && (
        <main className="flex flex-1 mt-6 gap-6 min-h-0">
          <Sidebar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
          <Content selectedMenu={selectedMenu} />
        </main>
      )}
    </div>
  );
};

export default Dashboard;
