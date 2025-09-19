import React from "react";
import styles from "./style.module.scss";

const Home = () => {
  return (
    <div className={styles["home__container"]}>
      <h1>Welcome to the Home Page!</h1>
      <p>This is a simple example of a protected route landing page.</p>
    </div>
  );
};

export default Home;
