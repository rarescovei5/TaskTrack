import { useSelector } from 'react-redux';
import Navbar from '../layout/Navbar';
import { RootState } from '../app/store';

const Workspace = () => {
  const appSettings = useSelector((state: RootState) => state.settings);
  return (
    <>
      <Navbar />
      <main
        className={`flex flex-1 mt-6 gap-6 transition-all duration-500 ease-in-out ${
          appSettings.isCollapsed ? 'opacity-0  -translate-y-10' : ''
        }`}
      ></main>
    </>
  );
};

export default Workspace;
