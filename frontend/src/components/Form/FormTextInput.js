import PropTypes from "prop-types";
import classNames from "classnames";
import { TextField } from "final-form-material-ui";
import { Field } from "./Field";

import { makeStyles } from "@material-ui/core/styles";
import style from "./style.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  focused: {},
  disabled: {},
  error: {},
  multiline: {},
  input: {
    fontFamily: "DM Sans, sans-serif!important",
    label: {
      fontSize: 6,
    },
  },
}));

export const FormTextInput = ({
  name,
  label,
  required,
  disabled,
  placeholder,
  onChange,
  variant,
  autoComplete,
  autoFocus,
  type,
  multiline,
  rows,
  select,
  children,
  InputProps,
  InputLabelProps,
  multiple,
  component,
  hidden,
  maxLength,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div
      className={classNames({
        [style["form__field__input__wrapper"]]: true,
        [style["hidden"]]: hidden,
      })}
    >
      <div className={style["form__field__input"]}>
        <Field
          name={name}
          component={component || TextField}
          label={label}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          variant={variant}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={classes.root}
          type={type}
          multiline={multiline}
          minRows={rows}
          select={select}
          children={children}
          InputProps={InputProps}
          InputLabelProps={InputLabelProps}
          multiple={multiple}
          maxLength={maxLength}
          {...rest}
        //   format={format}
        //   verify={verify}
        //   readOnly={readOnly}
        //   parse={parse}
        //   maxLength={maxLength}
        //   className={disableBorderInput}
        //   autoFocus={autoFocus}
        //   borderStatus={borderStatus}
        //   borderStatusType={borderStatusType}
        //   onKeyDown={onKeyDown}
        //   minLength={minLength}
        //   {...rest}
        />
      </div>
    </div>
  );
};

FormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  select: PropTypes.bool,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  multiple: PropTypes.bool,
  component: PropTypes.elementType,
  hidden: PropTypes.bool,
};

FormTextInput.defaultProps = {
  variant: "outlined",
  autoComplete: "off",
  type: "text",
};

export default FormTextInput;