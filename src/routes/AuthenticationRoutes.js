import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";
import MinimalLayout from "layout/MinimalLayout";
import { Navigate } from "react-router";
import { localStorageService } from "services/localStorage.services";

// login option 3 routing
const AuthLogin = Loadable(
  lazy(() => import("views/pages/authentication/authentication/Login"))
);

const AuthForgotPassword = Loadable(
  lazy(() => import("views/pages/authentication/authentication/ForgotPassword"))
);

const AuthResetPassword = Loadable(
  lazy(() => import("views/pages/authentication/authentication/ResetPassword"))
);

const NotFound = Loadable(lazy(() => import("views/pages/404")));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const GuestRoute = ({ children }) => {
  return localStorageService.get("nuvu_token") ? (
    <Navigate to={{ pathname: "/", state: { from: "" } }} />
  ) : (
    children
  );
};

const AuthenticationRoutes = {
  path: "/",
  element: (
    <GuestRoute>
      <MinimalLayout />{" "}
    </GuestRoute>
  ),
  children: [
    {
      path: "/login",
      element: <AuthLogin />,
    },
    {
      path: "/forgot-password",
      element: <AuthForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <AuthResetPassword />,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ],
};

export default AuthenticationRoutes;

// old code
// import { lazy } from "react";

// // project imports
// import Loadable from "ui-component/Loadable";
// import MinimalLayout from "layout/MinimalLayout";

// // login option 3 routing
// const AuthLogin3 = Loadable(
//   lazy(() => import("views/pages/authentication/authentication3/Login3"))
// );
// const AuthRegister3 = Loadable(
//   lazy(() => import("views/pages/authentication/authentication3/Register3"))
// );

// // ==============================|| AUTHENTICATION ROUTING ||============================== //

// const AuthenticationRoutes = {
//   path: "/",
//   element: <MinimalLayout />,
//   children: [
//     {
//       path: "/pages/login/login3",
//       element: <AuthLogin3 />,
//     },
//     {
//       path: "/pages/register/register3",
//       element: <AuthRegister3 />,
//     },
//   ],
// };

// export default AuthenticationRoutes;
