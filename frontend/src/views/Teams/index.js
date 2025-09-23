import React from "react";
import styles from "./style.module.scss";

const Teams = () => {
  return (
    <div className={styles["teams__container"]}>
      <h1>Teams</h1>
      <p>Manage your teams and team members here.</p>
      <div className={styles["teams__card"]}>
        <h3>Team Management</h3>
        <ul>
          <li>Create New Team</li>
          <li>Invite Team Members</li>
          <li>Manage Team Permissions</li>
          <li>View Team Analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default Teams;
