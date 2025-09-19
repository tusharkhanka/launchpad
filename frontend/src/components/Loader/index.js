import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

import styles from "./style.module.scss";

const Loader = () => {
  return (
    <div className={styles["loader"]}>
      <CircularProgress size={28} />
    </div>
  );
};

export default Loader;
