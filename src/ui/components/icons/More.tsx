import MoreSvg from '/More.svg';

const MoreIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={MoreSvg} alt="More" />;
};

export default MoreIcon;
