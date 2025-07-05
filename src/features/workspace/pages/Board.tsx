import { useAppSelector } from '@/app/hooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import Header from '../components/Header';
import { makeSelectBoardColumnsWithTasks, selectBoardById } from '../slices/boardsSlice';
import Info from '../components/Info';
import TasksVisualizer from '../components/TasksVisualizer';
import BoardSettings from '../components/BoardSettings';

const Board = () => {
  const workspaceId = useParams().workspaceId!;
  const boardId = useParams().boardId!;

  const workspaceName = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  ).name;
  const board = useAppSelector((state) => selectBoardById(state, boardId));

  const selectColumnsWithTasks = React.useMemo(
    () => makeSelectBoardColumnsWithTasks(),
    []
  );
  const tasks = useAppSelector((state) => selectColumnsWithTasks(state, boardId));

  React.useEffect(() => console.log('rerender'), [tasks]);

  const [query, setQuery] = React.useState('');
  return (
    <div className="h-full flex flex-col gap-3 px-4 pt-3">
      <Header
        breadCrumbs={[workspaceName, board.name]}
        query={query}
        setQuery={setQuery}
      />
      <Info
        title={board.name}
        description={board.description}
        SettingsContent={<BoardSettings board={board} />}
      />
      <TasksVisualizer
        columnsWithTasks={tasks}
        query={query}
        path={`/workspaces/${workspaceId}/boards/${boardId}`}
      />
    </div>
  );
};

export default Board;
