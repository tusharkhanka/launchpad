import React from "react";
import styles from "./style.module.scss";

const AdminPanel = () => {
  return (
    <div className={styles["admin-panel__container"]}>
      <h1>Admin Panel</h1>
      <p>Welcome to the Admin Panel! This is where administrative functions will be available.</p>
      <div className={styles["admin-panel__card"]}>
        <h3>Admin Features</h3>
        <ul>
          <li>User Management</li>
          <li>System Settings</li>
          <li>Analytics Dashboard</li>
          <li>Configuration Management</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
