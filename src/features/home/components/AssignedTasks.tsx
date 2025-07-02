import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import React from 'react';

type HomeAssignedTasksProps = React.HTMLAttributes<HTMLDivElement> & {};
const HomeAssignedTasks = (props: HomeAssignedTasksProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('Nearest Due Date');
  const [isSelectOpen, setIsSelectOpen] = React.useState<boolean>(false);

  const handleSelectOption = React.useCallback((option: string) => {
    setSelectedOption(option);
    setIsSelectOpen(false);
  }, []);

  return (
    <div {...props}>
      <div className="flex flex-row items-center justify-between">
        <h6 className="font-medium">Assigned Tasks</h6>
        {/* Filter Select */}
        <div className="relative typography-small">
          <button
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="flex items-center gap-2 border border-border rounded-md px-4 py-2 cursor-pointer"
          >
            <span>{selectedOption}</span>
            {!isSelectOpen ? <ChevronsUpDown size={12} /> : <ChevronsDownUp size={12} />}
          </button>
          {isSelectOpen && (
            <div className="absolute top-full mt-1 right-0 border border-border rounded-md z-10 text-nowrap">
              <ul>
                <li
                  className="px-4 py-2 cursor-pointer rounded-md hover:bg-border/50"
                  onClick={() => handleSelectOption('Nearest Due Date')}
                >
                  Nearest Due Date
                </li>
                <li
                  className="px-4 py-2 cursor-pointer rounded-md hover:bg-border/50"
                  onClick={() => handleSelectOption('Due Date')}
                >
                  Due Date
                </li>
                <li
                  className="px-4 py-2 cursor-pointer rounded-md hover:bg-border/50"
                  onClick={() => handleSelectOption('Priority')}
                >
                  Priority
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <hr className="border-border border-dashed" />
    </div>
  );
};

export default HomeAssignedTasks;
