import AddSvg from '/Add.svg';

const AddIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={AddSvg} alt="Add" />;
};

export default AddIcon;
