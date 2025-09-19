import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./style.module.scss";

export class FormError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      timeout: props.timeout,
    };
    this.interval = null;
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      const { timeout } = this.state;
      const { redirect, redirectHandle } = this.props;

      if (timeout <= 1000) {
        if (!redirect) {
          this.setState({ show: false });
          clearInterval(this.interval);
        } else {
          redirectHandle();
          clearInterval(this.interval);
        }
      } else {
        this.setState({ timeout: timeout - 1000 });
      }
    }, 1000);
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { message, className, redirect } = this.props;
    const { show, timeout } = this.state;

    return (
      <div className={classNames(styles["form__error"], className)}>{`${message}. ${
        redirect ? `You will be automatically redirected in ${timeout / 1000} seconds.` : ""
      }`}</div>
    );
  }
}

FormError.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
  className: PropTypes.string,
  timeout: PropTypes.number,
  redirect: PropTypes.bool,
  redirectHandle: PropTypes.func,
};

FormError.defaultProps = {
  show: false,
  message: null,
  className: "",
  timeout: 5000,
  redirect: false,
  redirectHandle: () => {},
};
