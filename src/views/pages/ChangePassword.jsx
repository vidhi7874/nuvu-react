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
import { AUTH_RESET_PASSWORD, DASHBOARD } from "hooks/apiConstants";

// ============================||  - CHANGE PASSWORD ||============================ //

const ChangePassword = ({ ...others }) => {
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

  const initialFormValues = {
    old_password: "",
    password: "",
    confirm_password: "",
    submit: null,
  };

  const schema = Yup.object().shape({
    old_password: Yup.string()
      .trim()
      .max(255)
      .required("Old Password is required"),
    password: Yup.string().trim().max(255).required("Password is required"),
    confirm_password: Yup.string()
      .max(255)
      .trim()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    // console.log("values", values);
    const result = await scriptedRef.api({
      url: DASHBOARD.CHANGE_PASSWORD.url,
      method: DASHBOARD.CHANGE_PASSWORD.method,
      body: {
        old_password: values.old_password,
        new_password: values.password,
        confirm_password: values.confirm_password,
        // id: new URLSearchParams(location).get("id"),
        // token: new URLSearchParams(location).get("token"),
      },
    });

    console.log("result", result);

    if (result?.message) {
      setErrors({
        submit:
          result?.response?.data?.message ||
          result?.response?.data?.Error[0] ||
          result?.message,
      });
      setSubmitting(false);
    } else {
      setSubmitting(false);
      setTimeout(() => {
        navigation("/login");
      }, 1000);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        validationSchema={schema}
        onSubmit={onSubmit}
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
          console.log(errors),
          (
            <Box
              margin={"auto"}
              width={{
                xs: "100%",
                md: "45%",
              }}
            >
              <Box
                borderRadius="30px"
                boxShadow="0px 0px 10px #008f6930"
                //  width="450px"
                flex="none"
                padding="50px 50px"
              >
                <Typography
                  variant="h3"
                  marginBottom={4}
                  fontSize="30px"
                  color="primary"
                >
                  Change Password
                </Typography>

                <form noValidate onSubmit={handleSubmit} {...others}>
                  {/* Old password */}
                  <Typography color="secondary">Old Password</Typography>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.old_password && errors.old_password)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <OutlinedInput
                      id="outlined-adornment-password-login"
                      type={showPassword ? "text" : "password"}
                      value={values.old_password}
                      name="old_password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Old Password"
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
                      label="old_password"
                      inputProps={{}}
                    />
                    {touched.old_password && errors.old_password && (
                      <FormHelperText error>
                        {errors.old_password}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/*New  Password */}
                  <Typography color="secondary">New Password</Typography>
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

                  {/* Confirm Password */}
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
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      inputProps={{}}
                    />
                    {touched.confirm_password && errors.confirm_password && (
                      <FormHelperText error>
                        {errors.confirm_password}
                      </FormHelperText>
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
              </Box>
            </Box>
          )
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
