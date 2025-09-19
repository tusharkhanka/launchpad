import PropTypes from "prop-types";
import arrayMutators from "final-form-arrays";
import { Form } from "react-final-form";
import Loader from "../Loader";

export const ReactFinalForm = ({ onSubmit, initialValues, validate, children, render, loading }) => {
  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      render={({ handleSubmit, values, submitting, pristine, errors, form: { mutators, reset, change } }) => {
        if (render) {
          return (
            <form
              onSubmit={async (event) => {
                const isReset = await handleSubmit(event);
                if (isReset) {
                  reset();
                }
              }}
              noValidate
            >
              {render({
                values,
                mutators,
                reset,
                errors,
                submitting,
                pristine,
                change,
              })}
            </form>
          );
        }

        return (
          <form
            onSubmit={async (event) => {
              const isReset = await handleSubmit(event);
              if (isReset) {
                reset();
              }
            }}
          >
            {children}
          </form>
        );
      }}
    />
  );
};

ReactFinalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  validate: PropTypes.func,
  render: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.element,
};
