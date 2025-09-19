import { validateEmail } from "../../utils/validateEmail";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Email address is required";
  } else if (!validateEmail(values.email)) {
    errors.email = "Email address is invalid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

export default validate;
