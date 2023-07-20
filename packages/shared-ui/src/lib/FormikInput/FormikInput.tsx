import { Input } from "../Input";
import { IFormikInputProps } from "./FormikInput.types";

export const FormikInput = <T,>({ form, id, disabled, ...rest }: IFormikInputProps<T>) => {
  let error: string | undefined;

  try {
    error = form.touched[id] && (form.errors[id] as string | undefined);
  } catch (e) {
    console.error("Could not get field: ", id, " from form: ", form);
    throw e;
  }

  const fieldProps = form.getFieldProps(id);

  return <Input id={id} error={error} {...fieldProps} {...rest} disabled={disabled} />;
};
