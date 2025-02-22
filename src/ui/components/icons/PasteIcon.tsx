import PasteSvg from '/Paste.svg';

const PasteIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={PasteSvg} alt="Paste" />;
};

export default PasteIcon;
