import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './features/home';
import Login from './features/auth';
import RequireAuth from './features/auth/components/RequireAuth';
import Workspace from './features/workspace/pages/Workspace';
import Board from './features/workspace/pages/Board';
import Templates from './features/workspace/pages/Templates';
import Members from './features/workspace/pages/Members';
import WorkspaceProvider from './features/workspace/components/context/WorkspaceProvider';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/*" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="workspaces/:workspaceId" Component={WorkspaceProvider}>
              <Route path="templates" element={<Templates />} />
              <Route path="members" element={<Members />} />
              <Route path="boards/:boardId/*" element={<Board />} />
              <Route path="*" element={<Workspace />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
