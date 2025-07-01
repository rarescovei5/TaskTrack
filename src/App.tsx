import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Workspace from './pages/Workspace';

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
