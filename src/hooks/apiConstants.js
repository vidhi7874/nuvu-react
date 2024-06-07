const AUTH_LOGIN = { url: "login/", method: "POST" };
const AUTH_FORGOT_PASSWORD = { url: "forgot_password/", method: "POST" };
const AUTH_RESET_PASSWORD = { url: "verify_password/", method: "POST" };

const DASHBOARD = {
  CHANGE_PASSWORD: {
    url: "change_password/",
    method: "POST",
  },
  GET_COMPANY: "/company/",
  COMPANY_WISE_DATA: "/company_wise_data/",
  CREATE_USER: "/create_user/",
  SEND_OTP: "/phone_number/",
  VERIFY_OTP: "/mobile_otp/",
  COUNTRY: "/country/",
  STATE: "/state/",
  DISTRICT: "/district/",
  ADD_NEW_ADDRESS: "/address/",

  CREATE_TICKET: "/ticket/create_ticket/",
};

export { AUTH_LOGIN, AUTH_FORGOT_PASSWORD, AUTH_RESET_PASSWORD, DASHBOARD };
