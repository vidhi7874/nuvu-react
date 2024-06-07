// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";

//assets imports
import Logo from "../../../../assets/images/nuvu-login.svg";
import ForgotPasswordImg from "../../../../assets/images/auth/forgot-password-main.svg";

// project imports
import AuthWrapper from "../AuthWrapper";
import ForgotPasswordForm from "../auth-forms/AuthForgotPassword";

// ================================|| AUTH - FORGOT PASSWORD ||================================ //

const ForgotPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AuthWrapper>
      <Box>
        <Box>
          <img src={Logo} alt="" className="" height="75px" width="215px" />
        </Box>
        <Stack
          gap="50px"
          marginTop="50px"
          justifyContent="space-around"
          alignItems="center"
          flexDirection={matchDownSM ? "column-reverse" : "row"}
        >
          <Box>
            <img
              src={ForgotPasswordImg}
              alt=""
              className=""
              width={matchDownSM ? "100%" : "650px"}
            />
          </Box>
          <Box
            borderRadius="30px"
            boxShadow="0px 0px 50px #008f6930"
            width="450px"
            flex="none"
            padding="50px 50px"
          >
            <Typography variant="h3" fontSize="30px" color="primary">
              Forgot Password
            </Typography>
            <Typography
              variant="subtitle1"
              marginTop="12px"
              marginBottom="20px"
              fontSize="14px"
              color="grey.100"
            >
              Please enter the email address you’d like your password reset
              information sent to
            </Typography>
            <ForgotPasswordForm />
          </Box>
        </Stack>
      </Box>
    </AuthWrapper>
  );
};

export default ForgotPassword;
