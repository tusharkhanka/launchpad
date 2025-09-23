import { Field as FormField } from "react-final-form";

const identity = (parse, value, maxLength) => {
  let newValue = value;
  if (parse) {
    newValue = parse(value);
  }
  if (maxLength && value?.length > maxLength) {
    newValue = value.substring(0, maxLength);
  }
  return newValue;
};

export const Field = (props) => {
  return <FormField {...props} parse={(value) => identity(props.parse, value, props.maxLength)} />;
};
