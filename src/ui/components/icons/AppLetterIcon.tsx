import AppLetterSvg from '/appLetter.svg';

const AppLetterIcon = ({ classes }: { classes?: string }) => {
  return <img className={classes} src={AppLetterSvg} alt="AppLetter" />;
};

export default AppLetterIcon;
