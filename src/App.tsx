import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './features/home';
import Workspace from './features/workspace';
import RequireAuth from './features/auth/RequireAuth';
import Login from './features/login';
import PersistAuth from './features/auth/PersistAuth';

function App() {
  return (
    <PersistAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/*" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="workspace/:workspaceId" element={<Workspace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistAuth>
  );
}
export default App;
