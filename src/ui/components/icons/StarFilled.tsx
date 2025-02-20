import StarFilledSvg from '/StarFilled.svg';

const StarFilledIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={StarFilledSvg} alt="StarFilled" />;
};

export default StarFilledIcon;
