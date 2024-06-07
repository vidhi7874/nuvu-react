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

// stack_height: yup
// .number()
// .required(() => null)
// .typeError(""),

const mobile_reg = /^\d{10}$/;
const validationSchema = yup.object().shape({
  address: yup.string().trim().required("Address is required"),
  country: yup
    .number()
    .required("Country is required")
    .typeError("Country is required"),
  state: yup
    .number()
    .required("State is required")
    .typeError("State is required"),
  district: yup
    .number()
    .required("District is required")
    .typeError("District is required"),
  city: yup.string().trim().required("City is required"),
  pincode: yup.string().trim().required("Pincode is required"),
});

const AddAddress = ({ id, onClose, height, selectItem }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
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
  const [selectedDropdownOption, setSelectedDropdownOption] = useState({
    selectedCountry: { label: "", value: "" },
    selectedState: { label: "", value: "" },
    selectedDistrict: { label: "", value: "" },
  });
  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    states: [],
    districts: [],
  });
  const [options, setOptions] = useState({
    options: [],
    copyOptions: [],
  });

  const selectedItem = (obj) => {
    console.log(obj);
    setSelectedItemObj(obj);
  };

  const selectedItemOnList = () => {
    selectItem(selectedItemObj);
    onClose();
  };

  const openAddAddressForm = () => {
    setIsShowForm({
      show: true,
      fetchApi: false,
    });
  };

  const fetchAddress = async () => {
    if (id) {
      try {
        const result = await scriptedRef.api({
          url: `${DASHBOARD.COMPANY_WISE_DATA}?company=${id}`,
          method: "GET",
        });

        console.log("result:", result);
        if (result.status === 200) {
          const lists =
            result?.data?.data?.address?.map((item) => ({
              label: item.address,
              value: item.id,
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

  const fetchCountry = async () => {
    try {
      const result = await scriptedRef.api({
        url: `${DASHBOARD.COUNTRY}`,
        method: "GET",
      });

      if (result.status === 200) {
        console.log("result:", result.data.data);
        const lists =
          result?.data?.data?.map((item) => ({
            label: item.country,
            value: item.id,
          })) || [];
        console.log(lists);
        setDropdownOptions((prev) => ({ ...prev, countries: lists }));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchState = async () => {
    try {
      const result = await scriptedRef.api({
        url: `${DASHBOARD.STATE}`,
        method: "GET",
      });

      if (result.status === 200) {
        console.log("result:", result.data.data);
        const lists =
          result?.data?.data?.map((item) => ({
            label: item.state,
            value: item.id,
          })) || [];
        console.log(lists);
        setDropdownOptions((prev) => ({ ...prev, states: lists }));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchDistrict = async () => {
    try {
      const result = await scriptedRef.api({
        url: `${DASHBOARD.DISTRICT}`,
        method: "GET",
      });

      if (result.status === 200) {
        console.log("result:", result.data.data);
        const lists =
          result?.data?.data?.map((item) => ({
            label: item.district,
            value: item.id,
          })) || [];
        console.log(lists);
        setDropdownOptions((prev) => ({ ...prev, districts: lists }));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const search = (val) => {
    let matchItems = [];

    if (val) {
      matchItems = options?.copyOptions?.filter((item) =>
        item.label.toLowerCase().includes(val.toLowerCase())
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      const result = await scriptedRef.api({
        url: `${DASHBOARD.ADD_NEW_ADDRESS}`,
        method: "POST",
        body: { ...data, company: id },
      });
      console.log(result);
      if (result.status === 201) {
        setIsLoading(false);
        setIsShowForm({
          show: false,
          fetchApi: true,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (isShowForm.fetchApi) {
      fetchAddress();
    }
  }, [isShowForm.fetchApi]);

  useEffect(() => {
    if (isShowForm.show) {
      fetchCountry();
      fetchState();
      fetchDistrict();
    }
  }, [isShowForm.show]);

  return (
    <Box>
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
              Add Address
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
              onClick={() => openAddAddressForm()}
              startIcon={<AddCircleOutline />}
            >
              Add Address
            </Button>
          </Box>
          {/* ------------------- */}
          <Box>
            <Box position="relative">
              <OutlinedInput
                position="sticky"
                top={0}
                id="phone_no"
                type="text"
                fullWidth
                label=""
                //  disabled
                placeholder="Search Address"
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
                >
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
              Select Address
            </Button>
          </Box>
        </>
      )}

      {/* Add new address form  */}
      {isShowForm.show && (
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Typography
                fontSize={20}
                fontWeight="bold"
                marginY="2"
                color="secondary"
              >
                Add Address
              </Typography>

              <Box>
                <Typography fontSize={20} marginY={4} color="secondary">
                  Address line - 1
                </Typography>
                <Box>
                  <Grid paddingY={2} container spacing={2}>
                    {/* address */}
                    <Grid item xs={12} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Address</Typography> */}
                        <FormControl
                          fullWidth
                          error={Boolean(touched?.address || errors?.address)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <OutlinedInput
                                {...field}
                                id="address"
                                type="text"
                                placeholder="Address"
                                label="address"
                              />
                            )}
                          />
                          {errors?.address && (
                            <FormHelperText error>
                              {errors.address.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12} sm={6} md={6} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Country</Typography> */}
                        <FormControl
                          fullWidth
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="country"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                label={null}
                                options={dropdownOptions?.countries || []}
                                getOptionLabel={(option) => option.label}
                                //displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                value={selectedDropdownOption?.selectedCountry}
                                onChange={(event, newValue) => {
                                  // autocompleteRef.current = newValue;
                                  setValue("country", newValue?.value, {
                                    shouldValidate: true,
                                  });
                                  setSelectedDropdownOption((prev) => ({
                                    ...prev,
                                    selectedCountry: newValue,
                                  }));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label=""
                                    placeholder="Country"
                                    error={Boolean(
                                      touched?.country || errors?.country
                                    )}
                                  />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value?.value
                                }
                              />
                            )}
                          />
                          {errors?.country && (
                            <FormHelperText error>
                              {errors.country.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6} md={6} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Country</Typography> */}
                        <FormControl
                          fullWidth
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                label={null}
                                options={dropdownOptions?.states || []}
                                getOptionLabel={(option) => option.label}
                                //displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                value={selectedDropdownOption?.selectedState}
                                onChange={(event, newValue) => {
                                  // autocompleteRef.current = newValue;
                                  setValue("state", newValue?.value, {
                                    shouldValidate: true,
                                  });
                                  setSelectedDropdownOption((prev) => ({
                                    ...prev,
                                    selectedState: newValue,
                                  }));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label=""
                                    placeholder="State"
                                    error={Boolean(
                                      touched?.state || errors?.state
                                    )}
                                  />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value?.value
                                }
                              />
                            )}
                          />
                          {errors?.state && (
                            <FormHelperText error>
                              {errors.state.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* District */}
                    <Grid item xs={12} sm={6} md={6} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Country</Typography> */}
                        <FormControl
                          fullWidth
                          error={Boolean(touched?.district || errors?.district)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="district"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                label={"District"}
                                options={dropdownOptions?.districts || []}
                                getOptionLabel={(option) => option.label}
                                //displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                value={selectedDropdownOption?.selectedDistrict}
                                onChange={(event, newValue) => {
                                  // autocompleteRef.current = newValue;
                                  setValue("district", newValue?.value, {
                                    shouldValidate: true,
                                  });
                                  setSelectedDropdownOption((prev) => ({
                                    ...prev,
                                    selectedDistrict: newValue,
                                  }));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label=""
                                    placeholder="District"
                                    error={Boolean(
                                      touched?.district || errors?.district
                                    )}
                                  />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value?.value
                                }
                              />
                            )}
                          />
                          {errors?.district && (
                            <FormHelperText error>
                              {errors.district.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* city */}
                    <Grid item xs={12} sm={6} md={6} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Address</Typography> */}
                        <FormControl
                          fullWidth
                          error={Boolean(touched?.city || errors?.city)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="city"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <OutlinedInput
                                {...field}
                                id="city"
                                type="text"
                                placeholder="City"
                                label="city"
                              />
                            )}
                          />
                          {errors?.city && (
                            <FormHelperText error>
                              {errors.city.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* pincode */}
                    <Grid item xs={12} data-aos="fade-up">
                      <Paper>
                        {/* <Typography color="secondary">Address</Typography> */}
                        <FormControl
                          fullWidth
                          error={Boolean(touched?.pincode || errors?.pincode)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <Controller
                            name="pincode"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <OutlinedInput
                                {...field}
                                id="pincode"
                                type="text"
                                placeholder="Pincode"
                                label="pincode"
                              />
                            )}
                          />
                          {errors?.pincode && (
                            <FormHelperText error>
                              {errors.pincode.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box mx="2">
                    <LoadingButton
                      type="submit"
                      fullWidth
                      loading={isLoading}
                      loadingPosition="start"
                      variant="contained"
                      color="primary"
                    >
                      Add Address
                    </LoadingButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default AddAddress;
