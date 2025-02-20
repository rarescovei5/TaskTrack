import TableSvg from '/Table.svg';

const TableIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={TableSvg} alt="Table" />;
};

export default TableIcon;
