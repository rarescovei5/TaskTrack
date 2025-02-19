import { useSelector } from 'react-redux';

import { RootState } from '../app/store';
import Navbar from '../layout/Navbar';

const Workspace = () => {
  const appSettings = useSelector((state: RootState) => state.settings);
  return (
    <>
      <Navbar />
      {!appSettings.isCollapsed && (
        <main className="flex flex-1 mt-6 gap-6"></main>
      )}
    </>
  );
};

export default Workspace;
