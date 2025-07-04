import { ColumnWithTasks } from '../types';
import { NavLink, Route, Routes } from 'react-router-dom';
import BoardView from './BoardView';
import TableView from './TableView';
import CalendarView from './CalendarView';
import { Calendar, Funnel, Kanban, Table } from 'lucide-react';

const TasksVisualizer = ({
  columnsWithTasks,
  path,
  query,
}: {
  columnsWithTasks: ColumnWithTasks[];
  query: string;
  path: string;
}) => {
  return (
    <>
      <div className="flex justify-between border-b border-b-border">
        <div className="flex items-center relative">
          {[
            { to: `${path}/board`, Icon: Kanban, label: 'Board' },
            { to: `${path}/table`, Icon: Table, label: 'Table' },
            { to: `${path}/calendar`, Icon: Calendar, label: 'Calendar' },
          ].map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              replace
              className={({ isActive }) => `
                    px-4 py-3 flex gap-2 items-center transition-colors duration-300 relative
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-[2px] after:bg-primary
                    after:origin-center after:transition-transform after:duration-300
                    ${
                      isActive
                        ? 'text-primary after:scale-x-100'
                        : 'text-muted after:scale-x-0'
                    }
                `}
            >
              <Icon size={16} />
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
        <div>
          <button className="px-4 py-2 flex gap-2 items-center transition-colors cursor-pointer">
            <Funnel size={16} />
            Filters
          </button>
        </div>
      </div>
      <Routes>
        <Route
          path="/*/board"
          element={<BoardView columnsWithTasks={columnsWithTasks} />}
        />
        <Route
          path="/*/table"
          element={<TableView columnsWithTasks={columnsWithTasks} />}
        />
        <Route
          path="/*/calendar"
          element={<CalendarView columnsWithTasks={columnsWithTasks} />}
        />
      </Routes>
    </>
  );
};

export default TasksVisualizer;
