import CollapseSvg from '/Collapse.svg';

const CollapseIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={CollapseSvg} alt="Collapse" />;
};

export default CollapseIcon;
