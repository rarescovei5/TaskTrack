import AssignedTasks from './components/AssignedTasks';
import Stats from './components/Stats';
import WorkspacesShowcase from './components/WorkspacesShowcase';

const Home = () => {
  return (
    <div className="p-6 flex flex-col gap-3 h-full overflow-y-auto">
      <div className="flex flex-row items-center justify-between px-4">
        <div>
          <h5>Home</h5>
          <p className="text-foreground">Monitor all of your workspaces and tasks here</p>
        </div>
      </div>
      <hr className="border-border" />
      <Stats />
      <div className="flex flex-row gap-3 flex-1">
        <div className="basis-3/3 flex flex-col gap-3">
          <WorkspacesShowcase className="flex-1 px-4 py-3 border border-border rounded-md flex flex-col gap-3 min-h-0" />
          <AssignedTasks className="flex-1 px-4 py-3 border border-border rounded-md flex flex-col gap-3 min-h-0" />
        </div>
      </div>
    </div>
  );
};

export default Home;
