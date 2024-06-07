import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import {
  AddCircleOutline,
  AddCircleOutlineOutlined,
  PersonOutline,
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
  Grid,
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
  Snackbar,
} from "@mui/material";
import { useSnackbar } from "notistack";
// import MuiAlert from "@material-ui/lab/Alert";
import { Box } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MuiOtpInput } from "mui-one-time-password-input";
import { DASHBOARD } from "hooks/apiConstants";
import { handleApiError } from "services/apiErrorHandler";
import useScriptRef from "hooks/useScriptRef";
import { LoadingButton } from "@mui/lab";

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
// const mobile_reg = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/;

const mobile_reg = /^\d{10}$/;
const validationSchema = yup.object().shape({
  full_name: yup.string().trim().required("Name is required"),
  email: yup.string().email().required("Email is required"),
});
const AddNewPerson = ({ id, onClose, height, selectItem }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const { enqueueSnackbar } = useSnackbar();
  const toast = useApiToast();
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors, touched },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isShowForm, setIsShowForm] = useState({
    show: false,
    fetchApi: false,
  });
  const [selectedItemObj, setSelectedItemObj] = useState({});
  const [options, setOptions] = useState({
    options: [],
    copyOptions: [],
  });

  const selectedItem = (obj) => {
    console.log(obj);
    setSelectedItemObj(obj);
  };

  const selectedItemOnList = () => {
    // setSelectedOption((prev) => ({ ...prev, person: selectedItemObj }));
    selectItem(selectedItemObj);
    onClose();
  };

  const addNewItem = () => {
    setIsShowForm(true);
    setIsShowForm((prev) => ({ ...prev, show: true, fetchApi: false }));
  };

  const search = (val) => {
    let matchItems = [];

    if (val) {
      matchItems = options?.copyOptions?.filter(
        (item) =>
          item.label.toLowerCase().includes(val.toLowerCase()) ||
          item.email.toLowerCase().includes(val.toLowerCase())
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

  const fetchPersonNames = async () => {
    if (id) {
      try {
        const result = await scriptedRef.api({
          url: `${DASHBOARD.COMPANY_WISE_DATA}?company=${id}`,
          method: "GET",
        });

        console.log("result:", result);
        if (result.status === 200) {
          const lists =
            result?.data?.data?.person?.map((item) => ({
              label: item.full_name,
              value: item.id,
              email: item.email,
              user_image: item.user_image,
            })) || [];

          console.log(lists);

          setOptions({
            options: lists,
            copyOptions: lists,
          });
        }
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      const result = await scriptedRef.api({
        url: DASHBOARD.CREATE_USER,
        method: "POST",
        body: {
          ...data,
          company: id,
        },
      });

      console.log("result:", result);
      if (result.status === 201) {
        setIsShowForm({
          show: false,
          fetchApi: true,
        });
        setIsLoading(false);
        reset({
          full_name: "",
          email: "",
        });
      } else {
        let msg = result?.response?.data?.message?.email?.[0];
        //toast.showSuccessToast(msg);
        enqueueSnackbar("message", { variant: "success" });
        setError("email", { type: "custom", message: msg });
      }
    } catch (error) {
      console.log(error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonNames();
  }, []);

  useEffect(() => {
    if (isShowForm.fetchApi) {
      fetchPersonNames();
    }
  }, [isShowForm.fetchApi]);

  return (
    <Box fullWidth height={height || 350}>
      {!isShowForm.show && (
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
              Person
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
              onClick={() => addNewItem()}
              startIcon={<AddCircleOutline />}
            >
              Add New Person
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
              //  disabled
              placeholder="Search Person"
              onChange={(e) => search(e.target.value)}
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
                  border: `1px solid #ABABAB`,
                  //  marginX: "4px",
                  marginY: "14px",
                  borderRadius: "10px",

                  "&:hover": {
                    border: `1px solid ${theme.palette.primary.main}!important`,
                  },
                }}
                // data-aos="fade-up"
              >
                <ListItemAvatar>
                  <Avatar alt={`user_img_${i}`} src={`${el?.user_image}`} />
                </ListItemAvatar>
                <ListItemText primary={el.label} secondary={el.email} />
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
            Select Person
          </Button>
        </>
      )}
      {isShowForm.show && (
        <>
          <Box>
            <Typography
              fontSize={20}
              fontWeight="bold"
              my="2"
              color="secondary"
            >
              Person
            </Typography>

            <Box marginTop={3}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid paddingY={2} container spacing={2}>
                  {/* Name */}
                  <Grid item xs={12}>
                    <Paper>
                      <Typography color="secondary">Name</Typography>
                      <FormControl
                        fullWidth
                        error={Boolean(touched?.full_name || errors?.full_name)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <Controller
                          name="full_name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <OutlinedInput
                              {...field}
                              id="full_name"
                              type="text"
                              placeholder="Name"
                              label="full_name"
                            />
                          )}
                        />
                        {errors?.full_name && (
                          <FormHelperText error>
                            {errors.full_name.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <Paper>
                      <Typography color="secondary">Email</Typography>
                      <FormControl
                        fullWidth
                        error={Boolean(touched?.email || errors?.email)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <OutlinedInput
                              {...field}
                              id="email"
                              type="text"
                              placeholder="Email"
                              label="email"
                            />
                          )}
                        />
                        {errors?.email && (
                          <FormHelperText error>
                            {errors.email.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Paper>
                  </Grid>
                </Grid>
                <LoadingButton
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  loadingPosition="start"
                  variant="contained"
                  color="primary"
                >
                  Add New Person
                </LoadingButton>
              </form>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddNewPerson;

// Function to show toast messages
const useApiToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccessToast = (message) => {
    enqueueSnackbar(message, { variant: "success" });
  };

  const showErrorToast = (message) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
