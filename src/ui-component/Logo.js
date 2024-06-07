// material-ui
import { useTheme } from "@mui/material/styles";
import Logo_svg from "assets/images/nuvu-login.svg";

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return <img src={Logo_svg} alt="nuvu_logo" height="50px" />;
};

export default Logo;
