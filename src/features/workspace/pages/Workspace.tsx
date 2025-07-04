import React from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectWorkspaceById } from '../slices/workspacesSlice';

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId));

  const [query, setQuery] = React.useState('');

  return (
    <div className="h-full flex flex-col gap-3 px-4 py-3">
      <Header breadCrumbs={[workspace.name]} query={query} setQuery={setQuery} />
    </div>
  );
};

export default Workspace;
