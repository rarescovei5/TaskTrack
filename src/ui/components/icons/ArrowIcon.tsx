import ArrowSvg from '/Arrow.svg';

const ArrowIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={ArrowSvg} alt="Arrow" />;
};

export default ArrowIcon;
