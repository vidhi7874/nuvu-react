import { useTheme } from "@emotion/react";
import {
  AddCircleOutline,
  AddCircleOutlineOutlined,
  SearchOutlined,
  Smartphone,
  TabletMacOutlined,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MuiOtpInput } from "mui-one-time-password-input";
import useScriptRef from "hooks/useScriptRef";
import { useEffect } from "react";
import { DASHBOARD } from "hooks/apiConstants";
import { handleApiError } from "services/apiErrorHandler";
import { LoadingButton } from "@mui/lab";

// const mobile_reg = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/;

const mobile_reg = /^\d{10}$/;
const validationSchema = yup.object().shape({
  new_mobile_number: yup
    .string()
    .required("Phone number is required")
    .min(10)
    .max(10)
    .matches(mobile_reg, "Invalid phone number"),
});
const AddNewPerson = ({
  id,
  onClose,
  height,
  selectItem,
  // setSelectedOption,
}) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    clearErrors,
    formState: { errors, touched },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [addNumber, setNumber] = useState({
    show: false,
    isFetch: false,
  });
  const [isShowOtpBox, setIsShowOtpBox] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("9033139135");
  const [session_key, setSession_key] = useState("");
  const [selectedItemObj, setSelectedItemObj] = useState({});
  const [showErr, setShowErr] = useState("");
  const [options, setOptions] = useState({
    options: [],
    copyOptions: [],
  });
  const [isShowForm, setIsShowForm] = useState({
    show: false,
    fetchApi: false,
  });

  const selectedItem = (obj) => {
    console.log(obj);
    setSelectedItemObj(obj);
  };

  const onChangeMobileNumber = (number) => {
    setMobileNumber(number);
    console.log(number);
  };

  const addNewNumber = () => {
    setNumber({
      show: true,
      isFetch: false,
    });
  };

  const selectedItemOnList = () => {
    // setSelectedOption((prev) => ({ ...prev, mobile: selectedItemObj }));
    selectItem(selectedItemObj);
    onClose();
  };

  const sendOtp = async () => {
    if (mobile_reg.test(mobileNumber)) {
      clearErrors("new_mobile_number");
      setIsLoading(true);
      //phone_number
      try {
        const result = await scriptedRef.api({
          url: DASHBOARD.SEND_OTP,
          method: "POST",
          body: {
            phone: `+91${mobileNumber}`,
            company: id,
          },
        });

        console.log("result:", result);
        if (result?.status === 201) {
          setSession_key(result.data.data.session_key);
          setIsShowOtpBox(true);
          setIsShowForm({
            show: false,
            fetchApi: true,
          });
          setIsLoading(false);
          // reset({
          //   full_name: "",
          //   email: "",
          // });
        } else {
          console.log(result);
          let msg = result?.response?.data?.message;
          console.log(result?.response?.data?.message);
          //toast.showSuccessToast(msg);
          // enqueueSnackbar("message", { variant: "success" });
          setError("new_mobile_number", { type: "custom", message: msg });
        }
      } catch (error) {
        console.log(error);
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("new_mobile_number", {
        type: "manual",
        message: "Invalid mobile number",
      });
    }
    //console.log("err", x);
  };

  const [otp, setOtp] = React.useState("");

  const handleChange = (newValue) => {
    console.log(newValue);
    setOtp(newValue);
  };

  const verifyOtp = async () => {
    if (otp) {
      setIsLoading(true);
      console.log(otp);

      try {
        const result = await scriptedRef.api({
          url: DASHBOARD.VERIFY_OTP,
          method: "POST",
          body: {
            otp,
            session_key,
          },
        });

        console.log("result:", result);
        if (result.status === 200) {
          setIsLoading(false);

          setNumber({
            show: false,
            isFetch: true,
          });

          setIsShowOtpBox(false);
        } else {
          let msg = result?.response?.data?.message;
          console.log(msg);
          setShowErr(msg);
          //  setError("email", { type: "custom", message: msg });
        }
      } catch (error) {
        console.log(error);
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const matchIsNumeric = (text) => {
    const isNumber = typeof text === "number";
    //  const isString = matchIsString(text);
    return (isNumber || text !== "") && !isNaN(Number(text));
  };

  const validateChar = (value, index) => {
    return matchIsNumeric(value);
  };

  const fetchPersonNames = async () => {
    try {
      const result = await scriptedRef.api({
        url: `${DASHBOARD.COMPANY_WISE_DATA}?company=${id}`,
        method: "GET",
        // params: {
        //   company: id,
        // },
      });

      //  console.log("result:", result.data.data.phone_number);
      if (result.status === 200) {
        const lists =
          result?.data?.data?.phone_number?.map((item) => ({
            label: item.phone,
            value: item.id,
          })) || [];

        setOptions({
          options: lists,
          copyOptions: lists,
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const search = (val) => {
    let matchItems = [];

    if (val) {
      matchItems = options?.copyOptions?.filter((item) =>
        item?.label?.toLowerCase().includes(val.toLowerCase())
      );

      setOptions((prev) => ({
        ...prev,
        options: matchItems,
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        options: prev.copyOptions,
      }));
    }

    console.log("matchItems", matchItems);
  };

  const resendOtp = () => {
    console.log("resend");
    setOtp("");
    setShowErr("");
    sendOtp();
  };

  useEffect(() => {
    fetchPersonNames();
  }, []);

  useEffect(() => {
    if (addNumber.isFetch) {
      fetchPersonNames();
    }
  }, [addNumber.isFetch]);

  return (
    <Box fullWidth height={350}>
      {addNumber.show && (
        <Box>
          <Box>
            <Paper>
              {!isShowOtpBox && (
                <>
                  <Typography fontSize={20} marginBottom={4} color="secondary">
                    Add Mobile no
                  </Typography>
                  <Typography color="secondary">Mobile no</Typography>

                  <FormControl
                    fullWidth
                    error={Boolean(
                      touched?.new_mobile_number || errors?.new_mobile_number
                    )}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <Controller
                      name="new_mobile_number"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          id="new_mobile_number"
                          type="text"
                          value={mobileNumber}
                          placeholder="Enter Person Name"
                          onChange={(e) => onChangeMobileNumber(e.target.value)}
                          label="new_mobile_number"
                        />
                      )}
                    />
                    {errors?.new_mobile_number && (
                      <FormHelperText error>
                        {errors.new_mobile_number.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <Box mx="2">
                    <LoadingButton
                      type="submit"
                      fullWidth
                      loading={isLoading}
                      onClick={() => sendOtp()}
                      loadingPosition="start"
                      variant="contained"
                      color="primary"
                    >
                      SEND OTP
                    </LoadingButton>
                  </Box>
                </>
              )}

              {isShowOtpBox && (
                <Box>
                  <Typography fontSize={20} marginBottom={4} color="secondary">
                    OTP Verification
                  </Typography>

                  <Typography my="2" color="secondary">
                    {`Enter the OTP sent to +91  ${mobileNumber} `}
                  </Typography>

                  <Box marginY={2}>
                    <MuiOtpInput
                      value={otp}
                      //validateChar={validateChar}
                      onChange={handleChange}
                    />
                  </Box>

                  <Typography fontSize={16} marginBottom={4} color="red">
                    {showErr}
                  </Typography>
                  <Box
                    fullWidth
                    display="flex"
                    spacing={{ xs: 4 }}
                    alignItems="center"
                  >
                    <Typography
                      fontSize={16}
                      marginBottom={4}
                      color="secondary"
                    >
                      Didn’t receive OTP code?
                    </Typography>

                    <Typography
                      marginX={2}
                      fontSize={12}
                      marginBottom={4}
                      color="#A9A9AA"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => resendOtp()}
                    >
                      Re-send OTP
                    </Typography>
                  </Box>
                  <Box mx="2">
                    <Button
                      fullWidth
                      // type="submit"
                      onClick={() => verifyOtp()}
                      variant="contained"
                      color="primary"
                    >
                      VERIFY OTP
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      )}
      {!addNumber.show && (
        <>
          <Box
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              fontSize={20}
              fontWeight="bold"
              my="2"
              color="secondary"
            >
              Numbers
            </Typography>

            <Button
              variant="outlined"
              sx={{
                background: `${theme.palette.primary.main}!important`,
                color: "white",
                paddingX: "20px",
                boxShadow: "none",
                borderRadius: 8,
              }}
              onClick={() => addNewNumber()}
              startIcon={<AddCircleOutline />}
            >
              Add New Number
            </Button>
          </Box>
          <Box position="relative">
            <OutlinedInput
              position="sticky"
              top={0}
              id="phone_no"
              type="text"
              fullWidth
              label=""
              onChange={(e) => search(e.target.value)}
              //  disabled
              placeholder="Search Number"
              endAdornment={
                <InputAdornment>
                  <IconButton
                    aria-label="toggle password visibility"
                    //   onClick={() => addMobileNumber()}
                    // onMouseDown={handleMouseDownPassword}
                    fontSize="2"
                    // edge="end"
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>

          <List
            fullWidth
            // fontSize={40}
            sx={{
              width: "100%",
              fontSize: "40",
              // maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            {options?.options?.map((el, i) => (
              <ListItem
                key={i}
                fullWidth
                alignItems="center"
                onClick={() => selectedItem(el)}
                sx={{
                  cursor: "pointer",

                  "&:hover": {
                    bgcolor: "#8effcf5e",
                  },
                }}
              >
                <ListItemAvatar>
                  <Smartphone />
                </ListItemAvatar>
                <ListItemText>{el?.label}</ListItemText>
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            fullWidth
            disabled={!options?.options?.length}
            sx={{
              background: `${theme.palette.primary.main}!important`,
              color: "white",
              paddingX: "20px",
              boxShadow: "none",
            }}
            onClick={() => selectedItemOnList()}
          >
            Select Mobile Number
          </Button>
        </>
      )}
    </Box>
  );
};

export default AddNewPerson;
