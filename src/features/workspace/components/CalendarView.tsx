import React from 'react';
import { ColumnWithTasks } from '../types';

const CalendarView = ({
  isInBoard,
  columnsWithTasks,
  query,
}: {
  isInBoard: boolean;
  columnsWithTasks: ColumnWithTasks[];
  query: string;
}) => {
  return <div>Calendar View</div>;
};

export default CalendarView;
