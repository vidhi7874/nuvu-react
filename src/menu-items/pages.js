// assets
import { IconKey } from "@tabler/icons";

// constant
const icons = {
  IconKey,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: "pages",
  title: "",
  caption: "",
  type: "group",

  children: [
    {
      id: "tickets",
      title: "All Tickets",
      type: "collapse",
      icon: icons.IconKey,

      children: [
        {
          id: "ftcTicket",
          title: "FTC Ticket",
          type: "item",
          url: "/pages/login/login3",
          target: false,
        },
        {
          id: "assignTicket",
          title: "Assign Ticket",
          type: "item",
          url: "/pages/register/register3",
          target: false,
        },
        {
          id: "spareTicket",
          title: "Spare Ticket",
          type: "item",
          url: "/pages/register/register3",
          target: false,
        },
        {
          id: "DeclineTicket",
          title: "Decline Ticket",
          type: "item",
          url: "/pages/register/register3",
          target: false,
        },
      ],
    },
  ],
};

export default pages;
