import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './features/home';
import Workspace from './features/workspace';

import Login from './features/auth';
import RequireAuth from './features/auth/components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/*" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="workspaces/:workspaceId" element={<Workspace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
