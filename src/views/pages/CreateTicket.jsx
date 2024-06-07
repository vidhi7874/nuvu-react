import React, { useState } from "react";
import PageWrapper from "./authentication/PageWrapper";
import {
  FormControl,
  OutlinedInput,
  Typography,
  Box,
  Grid,
  Paper,
  FormHelperText,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  TextField,
  TextareaAutosize,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
  InputAdornment,
  IconButton,
  ///  DatePicker,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddCircleOutline,
  AddCircleOutlineOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DynamicDialog from "ui-component/DynamicDialog";
import AddMobileNumber from "ui-component/AddMobileNumber";
import { useEffect } from "react";
import { handleApiError } from "services/apiErrorHandler";
import { DASHBOARD } from "hooks/apiConstants";
import useScriptRef from "hooks/useScriptRef";
import AddNewPerson from "ui-component/AddNewPerson";
import AddAddress from "ui-component/AddAddress";
import dayjs from "dayjs";
import { toastAlert } from "services/toastAlert";
import { useNavigate } from "react-router";

const mobile_reg = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/;
// const mobileNumberRegex = /^\+91\d{10}$/;

const validationSchema = yup.object().shape({
  company: yup.string().trim().required("Company is required"),
  customer_fk: yup
    .number()
    .required(() => "Person name is required")
    .typeError("Person name is required"),
  mobile_no: yup
    .number()
    .required(() => "Phone number is required")
    .typeError("Phone number is required"),
  address: yup
    .number()
    .required(() => "Address is required")
    .typeError("Address is required"),

  ticket_type: yup.string(),

  //========= @@ select query === "Installation" ( 1 = Installation  ) @@ ===============
  work_order_no: yup.number().when("ticket_type", {
    is: (value) => value === "1",
    then: () => yup.string().trim().required("Work order no is required"),
    otherwise: () => yup.string(),
  }),

  packing_slip_no: yup.string().when("ticket_type", {
    is: (value) => value === "1",
    then: () => yup.string().trim().required("Packing slip no is required"),
    otherwise: () => yup.string(),
  }),

  phone_no: yup.string().when("ticket_type", {
    is: (value) => value === "1",
    then: () =>
      yup
        .number()
        .required(() => "Mobile number is required")
        .typeError("Mobile number is required"),
    otherwise: () => yup.string(),
  }),

  equipement_brief: yup.string().when("ticket_type", {
    is: (value) => value === "1",
    then: () => yup.string().trim().required("Equipment brief is required"),
    otherwise: () => yup.string(),
  }),

  receive_in_good_condition: yup.string().when("ticket_type", {
    is: (value) => value === "1",
    then: () => yup.boolean(),
    //.oneOf([true || false], "You must confirm receipt in good condition."),
    otherwise: () => yup.boolean().notRequired(),
  }),

  product_trial_readliness_date: yup.string().when("ticket_type", {
    is: (value) => value === "1",
    then: () => yup.date().required("Date is required"),
    otherwise: () => yup.date().notRequired(),
  }),

  //========= @@ select query === "Service" @@ ===============
  //========= @@ select query === "Spares" @@ ===============
  //========= @@ select query === "Sales_inquiry" @@ ===============
  //========= @@ select query === "Other" @@ ===============
});

const CreateTicket = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, touched },
  } = methods;

  console.log("main errors -->", errors);

  const [openDialog, setOpenDialog] = useState({
    isOpenAddPersonDialog: false,
    isOpenAddMobileDialog: false,
    isOpenAddMobileDialog: false,
  });

  const [checkboxStatus, setCheckboxStatus] = useState({
    preInstallationChecklistStatus: {
      pending: false,
      ready: false,
      during_enginner_visit: false,
      not_understood_list: false,
      further_guideliness_needed: false,
    },
  });

  const [selectedValue, setSelectedValue] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState({
    company: {
      value: "",
      label: "",
    },
    person: {
      value: "",
      label: "",
    },
    mobile: {
      value: "",
      label: "",
    },
    selectQuery: {
      value: "",
      label: "",
    },
  });
  const autocompleteRef = React.useRef();

  const [dropdownOptions, setDropdownOptions] = React.useState({
    companies: [],
    persons: [],
    cities: [
      { value: "ms", label: "Mahesana" },
      { value: "ah", label: "Ahemdabad" },
    ],
    states: [
      { value: "ms", label: "Mahesana" },
      { value: "ah", label: "Ahemdabad" },
    ],
    counties: [
      { value: "ms", label: "Mahesana" },
      { value: "ah", label: "Ahemdabad" },
    ],
    selectQueries: [
      { value: "1", label: "Installation" },
      { value: "2", label: "Service" },
      { value: "3", label: "Spares" },
      { value: "4", label: "Sales inquiry" },
      { value: "5", label: "Other" },
    ],
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // open close add new person dialog

  const addNewPerson = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddPersonDialog: true,
    }));
  };

  const handleClosePersonDialog = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddPersonDialog: false,
    }));
  };

  // ======= open close add mobile number dialog
  const addMobileNumber = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddMobileDialog: true,
    }));
  };

  const handleCloseAddMobileDialog = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddMobileDialog: false,
    }));
  };

  // ======= open close address dialog
  const addAddress = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddAddressDialog: true,
    }));
  };

  const handleCloseAddressDialog = () => {
    setOpenDialog((prev) => ({
      ...prev,
      isOpenAddAddressDialog: false,
    }));
  };

  const onSubmit = async (data) => {
    let obj = {
      ...data,
      ...checkboxStatus?.preInstallationChecklistStatus,
      product_trial_readliness_date: dayjs(
        data.product_trial_readliness_date
      ).format("YYYY-MM-DD"),
    };
    console.log(obj);
    try {
      const result = await scriptedRef.api({
        url: DASHBOARD.CREATE_TICKET,
        method: "POST",
        body: obj,
      });

      if (result.status === 200) {
        toastAlert(200, result?.data?.message);
        navigate("/all-tickets");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchCompany = async () => {
    try {
      const result = await scriptedRef.api({
        url: DASHBOARD.GET_COMPANY,
        method: "GET",
      });

      console.log("result:", result);
      if (result.status === 200) {
        const lists = result?.data?.data?.map((item) => ({
          label: item.company_name,
          value: item.id,
        }));
        setDropdownOptions((prev) => ({
          ...prev,
          companies: lists,
        }));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const companyWiseData = async (obj) => {
    try {
      console.log("selectedOption", selectedOption);
      const result = await scriptedRef.api({
        url: `${DASHBOARD.COMPANY_WISE_DATA}?company=${obj.value}`,
        method: "GET",
        // params: {
        //   company: 1,
        // },
      });

      console.log("companyWiseData:", result);
      if (result.status === 200) {
        const lists = result?.data?.data?.person?.map((item) => ({
          label: item.full_name,
          value: item.id,
        }));
        setDropdownOptions((prev) => ({
          ...prev,
          persons: lists,
        }));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const onChangeCompany = (event, newValue) => {
    console.log("@@@@@@@@@@@", newValue);
    if (newValue !== null) {
      setValue("company", newValue?.value, {
        shouldValidate: true,
      });

      setSelectedOption((prev) => ({
        ...prev,
        company: newValue,
      }));
      companyWiseData(newValue);
    } else {
      setSelectedOption((prev) => ({
        ...prev,
        person: null,
      }));
    }
  };

  // all useEffects

  useEffect(() => {
    fetchCompany();
  }, []);

  useEffect(() => {
    console.log("checkboxStatus", checkboxStatus);
  }, [checkboxStatus]);

  return (
    <PageWrapper>
      <Box backgroundColor="#fff" borderRadius={2} padding={4}>
        <Typography variant="h1" color="grey.900" fontWeight="light">
          Create Tickets
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid paddingY={2} container spacing={2}>
              {/* company */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper>
                  <Typography color="secondary">Company</Typography>
                  <FormControl
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                  >
                    <Controller
                      name="company"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          label={null}
                          options={dropdownOptions?.companies || []}
                          getOptionLabel={(option) => option.label}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          value={selectedOption?.company}
                          onChange={(event, newValue) => {
                            onChangeCompany(event, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              error={Boolean(
                                touched?.company || errors?.company
                              )}
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value?.value
                          }
                        />
                      )}
                    />
                    {errors?.company && (
                      <FormHelperText error>
                        {errors.company.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Paper>
              </Grid>

              {/* Person */}
              <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
                <Paper>
                  <Typography color="secondary">Person</Typography>
                  <FormControl
                    fullWidth
                    error={Boolean(touched?.customer_fk || errors?.customer_fk)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <Controller
                      name="customer_fk"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          id="customer_fk"
                          type="text"
                          value={selectedOption?.person?.label}
                          disabled
                          placeholder="Person"
                          endAdornment={
                            <InputAdornment>
                              <Button
                                variant="outlined"
                                disabled={
                                  selectedOption?.company?.value ? false : true
                                }
                                sx={{
                                  background: selectedOption?.company?.value
                                    ? `${theme.palette.primary.main}!important`
                                    : "#d9d9d9",

                                  color: "white",
                                  cursor: selectedOption?.company?.value
                                    ? "pointer !important"
                                    : "revert-layer !important",

                                  paddingX: "20px",
                                  boxShadow: "none",
                                  borderRadius: 8,
                                }}
                                onClick={() => addNewPerson()}
                                startIcon={<AddCircleOutline />}
                              >
                                Add Person
                              </Button>
                            </InputAdornment>
                          }
                          label="customer_fk"
                        />
                      )}
                    />
                    {errors?.customer_fk && (
                      <FormHelperText error>
                        {errors.customer_fk.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Paper>
              </Grid>

              {/* Mobile no */}
              <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
                <Paper>
                  <Typography color="secondary">Mobile no</Typography>
                  <FormControl
                    fullWidth
                    error={Boolean(touched?.mobile_no || errors?.mobile_no)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <Controller
                      name="mobile_no"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          id="mobile_no"
                          type="text"
                          value={selectedOption.mobile.label}
                          disabled
                          placeholder="Mobile No"
                          endAdornment={
                            <InputAdornment>
                              <Button
                                variant="outlined"
                                disabled={
                                  selectedOption?.company?.value ? false : true
                                }
                                sx={{
                                  background: selectedOption?.company?.value
                                    ? `${theme.palette.primary.main}!important`
                                    : "#d9d9d9",
                                  color: "white",
                                  paddingX: "20px",
                                  boxShadow: "none",
                                  borderRadius: 8,
                                }}
                                onClick={() => addMobileNumber()}
                                startIcon={<AddCircleOutline />}
                              >
                                Add Mobile No
                              </Button>
                            </InputAdornment>
                          }
                          label="mobile_no"
                        />
                      )}
                    />
                    {errors?.mobile_no && (
                      <FormHelperText error>
                        {errors.mobile_no.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Paper>
              </Grid>

              {/* Address  */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper>
                  <Typography color="secondary">Address </Typography>
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
                          value={selectedOption?.address?.label}
                          disabled
                          placeholder="Address"
                          endAdornment={
                            <InputAdornment>
                              <Button
                                variant="outlined"
                                disabled={
                                  selectedOption?.company?.value ? false : true
                                }
                                sx={{
                                  background: selectedOption?.company?.value
                                    ? `${theme.palette.primary.main}!important`
                                    : "#d9d9d9",
                                  color: "white",
                                  paddingX: "20px",
                                  boxShadow: "none",
                                  borderRadius: 8,
                                }}
                                onClick={() => addAddress()}
                                startIcon={<AddCircleOutline />}
                              >
                                Add Address
                              </Button>
                            </InputAdornment>
                          }
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
            </Grid>

            {/* Select query */}
            <Box>
              <Grid paddingY={2} container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  //data-aos-anchor-placement="center-center"
                >
                  <Paper>
                    <Typography color="secondary">Select query</Typography>
                    <FormControl
                      fullWidth
                      sx={{ ...theme.typography.customInput }}
                    >
                      {/* ticket_type */}
                      <Controller
                        name="ticket_type"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            label={null}
                            options={dropdownOptions?.selectQueries || []}
                            getOptionLabel={(option) => option.label}
                            //displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            value={selectedOption?.selectQuery}
                            onChange={(event, newValue) => {
                              autocompleteRef.current = newValue;
                              setValue("ticket_type", newValue?.value, {
                                shouldValidate: true,
                              });
                              setSelectedOption((prev) => ({
                                ...prev,
                                selectQuery: newValue,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label=""
                                error={Boolean(
                                  touched?.ticket_type || errors?.ticket_type
                                )}
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value?.value
                            }
                          />
                        )}
                      />
                      {errors?.ticket_type && (
                        <FormHelperText error>
                          {errors.ticket_type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>

              <Box>
                {/* Create Installation ticket component  */}
                {selectedOption?.selectQuery?.value === "1" && (
                  <CreateInstallationTicket
                    selectedCompanyId={selectedOption?.company?.value}
                    setCheckboxStatus={setCheckboxStatus}
                    checkboxStatus={checkboxStatus}
                  />
                )}

                {/* service ticket component  */}
                {selectedOption?.selectQuery?.value === "2" && (
                  <CreateServiceTicket
                    selectedCompanyId={selectedOption?.company?.value}
                    setCheckboxStatus={setCheckboxStatus}
                    checkboxStatus={checkboxStatus}
                  />
                )}
              </Box>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </FormProvider>

        {openDialog.isOpenAddPersonDialog && (
          <DynamicDialog
            open={openDialog.isOpenAddPersonDialog}
            onClose={handleClosePersonDialog}
            title=""
            isShowCloseBtn={false}
            size="sm" // You can use 'sm', 'md', 'lg', or 'xl'
          >
            <AddNewPerson
              onClose={handleClosePersonDialog}
              height={350}
              selectItem={(obj) => {
                setSelectedOption((prev) => ({ ...prev, person: obj }));
                setValue("customer_fk", obj.value, {
                  shouldValidate: true,
                });
              }}
              id={selectedOption?.company?.value}
            />
          </DynamicDialog>
        )}

        {openDialog.isOpenAddMobileDialog && (
          <DynamicDialog
            open={openDialog.isOpenAddMobileDialog}
            onClose={handleCloseAddMobileDialog}
            title="Mobile Numbers"
            size="sm" // You can use 'sm', 'md', 'lg', or 'xl'
          >
            <AddMobileNumber
              onClose={handleCloseAddMobileDialog}
              height={350}
              // setSelectedOption={setSelectedOption}
              selectItem={(obj) => {
                setSelectedOption((prev) => ({ ...prev, mobile: obj }));
                setValue("mobile_no", obj.value, {
                  shouldValidate: true,
                });
              }}
              id={selectedOption?.company?.value}
            />
          </DynamicDialog>
        )}

        {/*  Add new address dialog */}
        {openDialog.isOpenAddAddressDialog && (
          <DynamicDialog
            open={openDialog.isOpenAddAddressDialog}
            onClose={handleCloseAddressDialog}
            title=""
            size="md" // You can use 'sm', 'md', 'lg', or 'xl'
          >
            <AddAddress
              onClose={handleCloseAddressDialog}
              height={350}
              // setSelectedOption={setSelectedOption}
              selectItem={(obj) => {
                setSelectedOption((prev) => ({ ...prev, address: obj }));
                setValue("address", obj.value, {
                  shouldValidate: true,
                });
              }}
              id={selectedOption?.company?.value}
            />
          </DynamicDialog>
        )}
      </Box>
    </PageWrapper>
  );
};

export default CreateTicket;

// ==================== Create installation ticket ==============
const CreateInstallationTicket = ({
  selectedCompanyId,
  setCheckboxStatus,
  checkboxStatus,
}) => {
  const theme = useTheme();
  const {
    handleSubmit,
    control,
    register,
    setValue,
    getValues,
    formState: { errors, touched },
  } = useFormContext();

  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    mobile: "",
  });
  // const [checkboxStatus, setCheckboxStatus] = useState({
  //   isReceiveInGoodCondition: "no",
  //   preInstallationChecklistStatus: {
  //     pending: false,
  //     ready: false,
  //     during_enginner_visit: false,
  //     not_understood_list: false,
  //     further_guideliness_needed: false,
  //   },
  // });

  const handleChangeReceiveInGoodCondition = (event) => {
    setCheckboxStatus((prev) => ({
      ...prev,
      isReceiveInGoodCondition: event.target.value,
    }));
    setValue(
      "receive_in_good_condition",
      event.target.value === "yes" ? "true" : "false",
      {
        shouldValidate: true,
      }
    );
  };

  const onChangePreInstallationChecklistStatus = (key, e) => {
    setCheckboxStatus((prev) => ({
      ...prev,
      preInstallationChecklistStatus: {
        ...prev.preInstallationChecklistStatus,
        [key]: e.target.checked,
      },
    }));
  };

  const [openDialog, setOpenDialog] = useState(false);

  const addMobileNumber = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  console.log("CreateInstallationTicket -> errors", errors);
  return (
    <Box>
      <Grid paddingY={2} container spacing={2}>
        {/* Work Order No*/}
        <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
          <Paper>
            <Typography color="secondary">Work order no</Typography>
            <FormControl
              fullWidth
              error={Boolean(touched?.work_order_no || errors?.work_order_no)}
              sx={{ ...theme.typography.customInput }}
            >
              <Controller
                name="work_order_no"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="work_order_no"
                    type="text"
                    placeholder="Work order No"
                    label="work_order_no"
                  />
                )}
              />
              {errors?.work_order_no && (
                <FormHelperText error>
                  {errors.work_order_no.message}
                </FormHelperText>
              )}
            </FormControl>
          </Paper>
        </Grid>
        {/* Packing slip  No*/}
        <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
          <Paper>
            <Typography color="secondary">Packing slip no</Typography>
            <FormControl
              fullWidth
              error={Boolean(
                touched?.packing_slip_no || errors?.packing_slip_no
              )}
              sx={{ ...theme.typography.customInput }}
            >
              <Controller
                name="packing_slip_no"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="packing_slip_no"
                    type="text"
                    placeholder="Work order No"
                    label="packing_slip_no"
                  />
                )}
              />
              {errors?.packing_slip_no && (
                <FormHelperText error>
                  {errors.packing_slip_no.message}
                </FormHelperText>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Mobile no */}
        <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
          <Paper>
            <Typography color="secondary">Mobile no</Typography>
            <FormControl
              fullWidth
              error={Boolean(touched?.phone_no || errors?.phone_no)}
              sx={{ ...theme.typography.customInput }}
            >
              <Controller
                name="phone_no"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="phone_no"
                    type="text"
                    disabled
                    placeholder="Mobile No"
                    value={selectedOption?.mobile?.label}
                    endAdornment={
                      <InputAdornment>
                        <Button
                          variant="outlined"
                          disabled={selectedCompanyId ? false : true}
                          sx={{
                            background: selectedCompanyId
                              ? `${theme.palette.primary.main}!important`
                              : "#d9d9d9",
                            color: "white",
                            paddingX: "20px",
                            boxShadow: "none",
                            borderRadius: 8,
                          }}
                          onClick={() => addMobileNumber()}
                          startIcon={<AddCircleOutline />}
                        >
                          Add Address
                        </Button>
                      </InputAdornment>
                    }
                    label="phone_no"
                  />
                )}
              />
              {errors?.phone_no && (
                <FormHelperText error>{errors.phone_no.message}</FormHelperText>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Equipment brief */}
        <Grid item xs={12} data-aos="fade-up">
          <Paper>
            {/* <Typography color="secondary">Mobile no</Typography> */}
            <FormControl
              fullWidth
              error={Boolean(
                touched?.equipement_brief || errors?.equipement_brief
              )}
              sx={{ ...theme.typography.customTextArea }}
            >
              <Controller
                name="equipement_brief"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    id="equipement_brief"
                    placeholder="Equipment brief"
                    label="equipement_brief"
                    minRows={3} // Set the minimum number of rows
                  />
                )}
              />
              {errors?.equipement_brief && (
                <FormHelperText error>
                  {errors.equipement_brief.message}
                </FormHelperText>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Receive in good condition radio */}
        <Grid item xs={12} data-aos="fade-up">
          <Paper>
            <FormControl>
              <Typography
                id="demo-row-radio-buttons-group-label"
                color="secondary"
              >
                Receive in good condition
              </Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(e) => handleChangeReceiveInGoodCondition(e)}
                value={
                  checkboxStatus?.isReceiveInGoodCondition === "yes"
                    ? "yes"
                    : "no"
                }
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Pre Installation Checklist Status */}
        <Grid item xs={12} data-aos="fade-up">
          <Paper>
            <FormControl
            //error={error}
            >
              <Typography color="secondary">
                Pre Installation Checklist Status
              </Typography>

              <FormGroup>
                <Box
                  display={{
                    xs: "column",
                    md: "flex",
                  }}
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChangePreInstallationChecklistStatus("pending", e)
                        }
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="Pending"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChangePreInstallationChecklistStatus("ready", e)
                        }
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="Ready"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChangePreInstallationChecklistStatus(
                            "during_enginner_visit",
                            e
                          )
                        }
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="During Engg visit"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChangePreInstallationChecklistStatus(
                            "not_understood_list",
                            e
                          )
                        }
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="Not understood List"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChangePreInstallationChecklistStatus(
                            "further_guideliness_needed",
                            e
                          )
                        }
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="Further Tech Guidance needed"
                  />
                </Box>
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Production trial redline date*/}
        <Grid item xs={12} sm={6} md={4} data-aos="fade-up">
          <Paper>
            <Typography color="secondary">
              Production trial redline date fffff
            </Typography>
            <FormControl
              fullWidth
              error={Boolean(
                touched?.product_trial_readliness_date ||
                  errors?.product_trial_readliness_date
              )}
              sx={{ ...theme.typography.customInput }}
            >
              <Controller
                name="product_trial_readliness_date"
                control={control}
                // defaultValue=""
                // product_trial_readliness_date
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="product_trial_readliness_date"
                    type="date"
                    value={getValues("product_trial_readliness_date")}
                    // placeholder=""
                    label="product_trial_readliness_date"
                    onChange={(e) => {
                      console.log(dayjs(e.target.value).format("YYYY-MM-DD"));
                      setValue(
                        "product_trial_readliness_date",
                        e.target.value,
                        {
                          shouldValidate: true,
                        }
                      );
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
              {errors?.product_trial_readliness_date && (
                <FormHelperText error>
                  {errors.product_trial_readliness_date.message}
                </FormHelperText>
              )}
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      {openDialog && (
        <DynamicDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Add Mobile Number"
          size="sm" // You can use 'sm', 'md', 'lg', or 'xl'
        >
          <AddMobileNumber
            onClose={() => setOpenDialog(false)}
            height={350}
            //  setSelectedOption={setSelectedOption}
            selectItem={(obj) => {
              setSelectedOption({ mobile: obj });
              setValue("phone_no", obj.value, {
                shouldValidate: true,
              });
            }}
            id={selectedCompanyId}
          />
        </DynamicDialog>
      )}
    </Box>
  );
};

// ==================== Create service ticket ==============

const CreateServiceTicket = ({
  selectedCompanyId,
  setCheckboxStatus,
  checkboxStatus,
}) => {
  return <Box>create service ticket</Box>;
};

// ==================== Create sales inquiry ticket ==============
// ==================== Create other ticket ==============
// ==================== Create spares ticket ==============
// ==================== Create spares ticket ==============
