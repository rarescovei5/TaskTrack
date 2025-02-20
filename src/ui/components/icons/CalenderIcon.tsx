import CalendarSvg from '/Calendar.svg';

const CalendarIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={CalendarSvg} alt="Calendar" />;
};

export default CalendarIcon;
