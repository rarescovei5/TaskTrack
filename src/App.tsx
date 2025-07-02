import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './features/home';
import Workspace from './features/workspace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" Component={AppLayout}>
          <Route index Component={Home} />
          <Route path="workspace/:workspaceId" Component={Workspace} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
