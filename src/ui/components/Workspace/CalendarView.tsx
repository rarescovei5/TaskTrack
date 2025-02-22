import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TableViewProps } from '../../types';
import {
  saveWorkspaces,
  toggleToDoCompleted,
} from '../../app/slices/workspacesSlice';
import CheckIcon from '../icons/Check';

interface CalendarViewProps {
  items: Record<string, TableViewProps[]>;
  workspaceId: number;
}

const CalendarView: React.FC<CalendarViewProps> = ({ items, workspaceId }) => {
  // State for the current month/year we’re displaying
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();

  // Flatten tasks from all lists
  const tasks = Object.values(items).flat();

  // Helper function to check if two dates fall on the same calendar day
  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  // Today's date for highlighting
  const today = new Date();

  // Generate a matrix of dates for the current month, including leading/trailing days
  const calendarDates = generateCalendarDates(currentDate);

  // Handlers for navigating months
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="px-4 py-2 bg-slate-800/50 rounded-2xl border-[1px] border-transparent hover:border-accent transition-all cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-slate-800/50 rounded-2xl border-[1px] border-transparent hover:border-accent transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 bg-slate-800/50 rounded-2xl border-[1px] border-transparent hover:border-accent transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-white/50" />

      {/* Month/Year Title */}
      <div className="p-4 text-center font-bold">
        {currentDate.toLocaleString('default', { month: 'long' })}{' '}
        {currentDate.getFullYear()}
      </div>

      {/* Calendar Grid (Days of the Week) */}
      <div className="grid grid-cols-7 text-center font-semibold border-b border-white/20">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid (Dates) */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto">
        {calendarDates.map((day, idx) => {
          // Check if day is in the current month
          const isCurrentMonth =
            day.getMonth() === currentDate.getMonth() &&
            day.getFullYear() === currentDate.getFullYear();
          // Check if day is today
          const isToday = isSameDay(day, today);
          // Filter tasks whose dueDate matches the current day
          const dayTasks = tasks.filter((task) => {
            if (!task.dueDate) return false;
            // dueDate is stored as a string, so convert to Date
            const dueDateObj = new Date(task.dueDate);
            return isSameDay(dueDateObj, day);
          });

          return (
            <div
              key={idx}
              className={`border-l h-32 border-b border-white/10 p-2  overflow-auto 
                ${isCurrentMonth ? '' : 'text-gray-500'} 
                ${isToday ? 'border-l-accent border-l-2 bg-accent/5' : ''}`}
            >
              {/* Day Number */}
              <div className="text-sm mb-1 font-semibold">{day.getDate()}</div>

              {/* Tasks for this Day */}
              {dayTasks.map((task, index) => (
                <div
                  key={index}
                  className={`group flex items-center relative rounded px-4 py-2 mb-1 ${
                    task.isCompleted
                      ? 'bg-accent/10 line-through'
                      : 'bg-slate-800/50'
                  }`}
                >
                  {/* Checkbox Button */}
                  <button
                    className={`absolute left-2 cursor-pointer grid place-content-center w-4 h-4 transition-all duration-300 aspect-square border border-white/50 rounded-full ${
                      task.isCompleted
                        ? 'bg-accent'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={() => {
                      dispatch(
                        toggleToDoCompleted({
                          workspaceId: workspaceId,
                          boardId: task.boardId,
                          cardId: task.listId,
                          todoId: task.id,
                        })
                      );
                      dispatch(saveWorkspaces());
                    }}
                  >
                    {task.isCompleted && <CheckIcon classes="w-2 h-2" />}
                  </button>

                  {/* Task Title */}
                  <div
                    className={`transition-all duration-300 ${
                      task.isCompleted ? 'ml-4' : 'group-hover:ml-4'
                    }`}
                  >
                    <p className="break-all">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;

/**
 * generateCalendarDates:
 * Generates an array of Date objects representing the days
 * in the current month plus leading/trailing days to fill out
 * a 6-row grid.
 */
function generateCalendarDates(baseDate: Date): Date[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  // Start at the first day of the month
  const firstOfMonth = new Date(year, month, 1);
  // End at the last day of the month
  const lastOfMonth = new Date(year, month + 1, 0);

  // Determine the day of week for the first and last day
  const startDay = firstOfMonth.getDay();
  const endDay = lastOfMonth.getDay();

  const daysInMonth = lastOfMonth.getDate();
  const daysFromPrevMonth = startDay;
  const daysFromNextMonth = 6 - endDay;

  const calendarDays: Date[] = [];

  // Add days from previous month
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month, 1 - i - 1));
  }

  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // Add days from next month
  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDays.push(new Date(year, month + 1, i));
  }

  return calendarDays;
}
