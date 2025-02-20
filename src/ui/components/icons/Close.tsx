import CloseSvg from '/Close.svg';

const CloseIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={CloseSvg} alt="Close" />;
};

export default CloseIcon;
