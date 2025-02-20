import EditSvg from '/Edit.svg';

const EditIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={EditSvg} alt="Edit" />;
};

export default EditIcon;
