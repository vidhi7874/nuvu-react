// assets
import { IconDashboard } from "@tabler/icons";

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/dashboard/default",
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
    {
      id: "all_ticket",
      title: "All Ticket",
      type: "item",
      url: "/all-tickets",
      icon: icons.IconDashboard,
      breadcrumbs: true,
    },
  ],
};

export default dashboard;
