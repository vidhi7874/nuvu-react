import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router";
import { localStorageService } from "services/localStorage.services";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

const ChangePassword = Loadable(
  lazy(() => import("views/pages/ChangePassword"))
);

const CreateTicket = Loadable(lazy(() => import("views/pages/CreateTicket")));
const AllTickets = Loadable(lazy(() => import("views/pages/AllTickets")));

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));

const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));

const NotFound = Loadable(lazy(() => import("views/pages/404")));
// ==============================|| MAIN ROUTING ||============================== //

const ProtectedRoutes = ({ children }) => {
  return localStorageService.get("nuvu_token") ? (
    children
  ) : (
    <Navigate to={{ pathname: "/login", state: { from: "" } }} />
  );
};

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoutes>
      <MainLayout />{" "}
    </ProtectedRoutes>
  ),
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
    {
      path: "/create-ticket",
      element: <CreateTicket />,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "all-tickets",
      element: <AllTickets />,
    },
    {
      path: "utils",
      children: [
        {
          path: "util-typography",
          element: <UtilsTypography />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-color",
          element: <UtilsColor />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-shadow",
          element: <UtilsShadow />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "tabler-icons",
          element: <UtilsTablerIcons />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "material-icons",
          element: <UtilsMaterialIcons />,
        },
      ],
    },
    {
      path: "sample-page",
      element: <SamplePage />,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;

// old code ------------

// import { lazy } from 'react';

// // project imports
// import MainLayout from 'layout/MainLayout';
// import Loadable from 'ui-component/Loadable';

// // dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// // utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// // sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// // ==============================|| MAIN ROUTING ||============================== //

// const MainRoutes = {
//   path: '/',
//   element: <MainLayout />,
//   children: [
//     {
//       path: '/',
//       element: <DashboardDefault />
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'default',
//           element: <DashboardDefault />
//         }
//       ]
//     },
//     {
//       path: 'utils',
//       children: [
//         {
//           path: 'util-typography',
//           element: <UtilsTypography />
//         }
//       ]
//     },
//     {
//       path: 'utils',
//       children: [
//         {
//           path: 'util-color',
//           element: <UtilsColor />
//         }
//       ]
//     },
//     {
//       path: 'utils',
//       children: [
//         {
//           path: 'util-shadow',
//           element: <UtilsShadow />
//         }
//       ]
//     },
//     {
//       path: 'icons',
//       children: [
//         {
//           path: 'tabler-icons',
//           element: <UtilsTablerIcons />
//         }
//       ]
//     },
//     {
//       path: 'icons',
//       children: [
//         {
//           path: 'material-icons',
//           element: <UtilsMaterialIcons />
//         }
//       ]
//     },
//     {
//       path: 'sample-page',
//       element: <SamplePage />
//     }
//   ]
// };

// export default MainRoutes;
