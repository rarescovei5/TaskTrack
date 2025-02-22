import ColorSvg from '/Color.svg';

const ColorIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={ColorSvg} alt="Color" />;
};

export default ColorIcon;
