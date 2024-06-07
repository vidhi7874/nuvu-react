// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useState } from "react";
import { Stack } from "@mui/system";
import Success from "../../../../assets/images/success-logo.svg";
import { AUTH_FORGOT_PASSWORD } from "hooks/apiConstants";

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const ForgotPasswordForm = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    backgroundColor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    ":focus-visible": { outline: "none" },
  };

  const [open, setOpen] = useState(false);
  
  const handleClose = () => setOpen(false);

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const result = await scriptedRef.api({
            url: AUTH_FORGOT_PASSWORD.url,
            method: AUTH_FORGOT_PASSWORD.method,
            body: {
              email: values.email,
            },
          });

          if (result?.message) {
            setErrors({
              submit: result?.response?.data?.message || result?.message,
            });
            setSubmitting(false);
          } else {
            setOpen(true);
            setSubmitting(false);
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
            <Typography color="secondary">Email</Typography>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email"
                placeholder="Email"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
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
                  {isSubmitting ? "Loading ..." : "SEND"}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <img src={Success} alt="" width="80px" height="80px" />
            <Typography
              variant="h3"
              fontSize="24px"
              width="300px"
              color="secondary"
              textAlign="center"
              marginTop="20px"
              noWrap
            >
              Your request has been sent{" "}
              <Typography
                variant="h3"
                fontSize="24px"
                width="300px"
                color="primary"
                textAlign="center"
              >
                Successfully .
              </Typography>{" "}
              please check your email !!
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ForgotPasswordForm;
