import CheckSvg from '/Check.svg';

const CheckIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={CheckSvg} alt="Check" />;
};

export default CheckIcon;
