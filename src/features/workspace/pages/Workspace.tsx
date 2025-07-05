import React from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  makeSelectWorkspaceColumnsWithTasks,
  selectWorkspaceById,
} from '../slices/workspacesSlice';
import Info from '../components/Info';
import TasksVisualizer from '../components/TasksVisualizer';
import WorkspaceSettings from '../components/WorkspaceSettings';

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId));

  const selectWorkspaceColumnsWithTasks = React.useMemo(
    () => makeSelectWorkspaceColumnsWithTasks(),
    []
  );
  const tasks = useAppSelector((state) =>
    selectWorkspaceColumnsWithTasks(state, workspaceId)
  );

  const [query, setQuery] = React.useState('');

  return (
    <div className="h-full flex flex-col gap-3 px-4 py-3">
      <Header breadCrumbs={[workspace.name]} query={query} setQuery={setQuery} />
      <Info
        title={workspace.name}
        description={workspace.description}
        SettingsContent={<WorkspaceSettings workspace={workspace} />}
      />
      <TasksVisualizer
        columnsWithTasks={tasks}
        query={query}
        path={`/workspaces/${workspaceId}`}
      />
    </div>
  );
};

export default Workspace;
