import ListSvg from '/List.svg';

const ListIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={ListSvg} alt="List" />;
};

export default ListIcon;
