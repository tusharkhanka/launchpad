import React, { useState } from "react";
import { Link } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Tooltip } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Home";
import AdminPanelIcon from "@material-ui/icons/Settings";
import GroupIcon from "@material-ui/icons/Group";
import AppsIcon from "@material-ui/icons/Apps";
import HistoryIcon from "@material-ui/icons/History";

import { AppContext } from "config/context";
import { sideBarWidth } from "config/constants";

import styles from "./style.module.scss";

const sideBarContainers = [
  {
    id: "home",
    name: "Home",
    to: "/home",
    icon: <DashboardIcon />,
  },
  {
    id: "admin",
    name: "Admin Panel",
    to: "/admin",
    icon: <AdminPanelIcon />,
  },
  {
    id: "teams",
    name: "Teams",
    to: "/teams",
    icon: <GroupIcon />,
  },
  {
    id: "applications",
    name: "Applications",
    to: "/applications",
    icon: <AppsIcon />,
  },
  {
    id: "auditLogs",
    name: "Audit Logs",
    to: "/audit-logs",
    icon: <HistoryIcon />,
  },
];

const drawerWidth = sideBarWidth;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activeLink, setActiveLink] = useState();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles["sidebar__root"]}>
      <CssBaseline />
      <AppContext.Consumer>
        {({ navbarToggle, windowWidth, handleNavbarToggle }) => {
          if (navbarToggle != open) {
            setOpen(navbarToggle);
          }
          return (
            <Drawer
              variant="permanent"
              open={navbarToggle}
              className={`${styles["sidebar__drawer"]} ${navbarToggle ? styles["sidebar__drawer--open"] : styles["sidebar__drawer--closed"]}`}
              classes={{
                paper: `${styles["sidebar__drawer-paper"]} ${navbarToggle ? styles["sidebar__drawer-paper--open"] : styles["sidebar__drawer-paper--closed"]}`,
              }}
            >
              <List>
                {sideBarContainers.map((link, index) => {
                  return (
                    <Link
                      key={index}
                      to={link?.to}
                      className={styles["sidebar__link"]}
                      onClick={() => {
                        setActiveLink(link?.name);
                        if (windowWidth <= 600) {
                          handleNavbarToggle();
                        }
                      }}
                    >
                      <ListItem button>
                        {!navbarToggle ? (
                          <Tooltip title={link?.name}>
                            <ListItemIcon>{link.icon}</ListItemIcon>
                          </Tooltip>
                        ) : (
                          <ListItemIcon>{link.icon}</ListItemIcon>
                        )}
                        <ListItemText primary={link?.name} />
                      </ListItem>
                    </Link>
                  );
                })}
              </List>
            </Drawer>
          );
        }}
      </AppContext.Consumer>
    </div>
  );
}
