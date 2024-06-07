import { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLocation, useNavigate } from "react-router";
import { AUTH_RESET_PASSWORD } from "hooks/apiConstants";

// ============================|| FIREBASE - RESETPASSWORD ||============================ //

const ResetPasswordForm = ({ ...others }) => {
  const navigation = useNavigate();

  let location = useLocation().search;

  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          password: "",
          confirm_password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .trim()
            .max(255)
            .required("Password is required"),
          confirm_password: Yup.string()
            .max(255)
            .trim()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Passwords must match"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const result = await scriptedRef.api({
            url: AUTH_RESET_PASSWORD.url,
            method: AUTH_RESET_PASSWORD.method,
            body: {
              newpassword: values.password,
              confirmpassword: values.confirm_password,
              id: new URLSearchParams(location).get("id"),
              token: new URLSearchParams(location).get("token"),
            },
          });

          if (result?.message) {
            setErrors({
              submit: result?.response?.data?.message || result?.message,
            });
            setSubmitting(false);
          } else {
            setSubmitting(false);
            setTimeout(() => {
              navigation("/login");
            }, 1000);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Typography color="secondary">Password</Typography>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>
            <Typography color="secondary"> Confirm Password </Typography>
            <FormControl
              fullWidth
              error={Boolean(
                touched.confirm_password && errors.confirm_password
              )}
              sx={{ ...theme.typography.customInput }}
            >
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirm_password}
                name="confirm_password"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Confirm Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.confirm_password && errors.confirm_password && (
                <FormHelperText error>{errors.confirm_password}</FormHelperText>
              )}
            </FormControl>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ ":hover": { backgroundColor: "#30966B" } }}
                >
                  {isSubmitting ? "Loading ..." : "CHANGE PASSWORD"}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
