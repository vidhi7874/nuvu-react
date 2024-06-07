// material-ui
import { styled } from "@mui/material/styles";

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.paper,
  minHeight: "100vh",
  padding: "30px 70px",
}));

export default AuthWrapper;
