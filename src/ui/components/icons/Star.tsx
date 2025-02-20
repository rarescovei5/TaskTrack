import StarSvg from '/Star.svg';

const StarIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={StarSvg} alt="Star" />;
};

export default StarIcon;
