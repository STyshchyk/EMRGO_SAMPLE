import { Input, MySelect } from "@emrgo-frontend/shared-ui";

import { InputFile } from "../InputFile";
import { IFormikInputProps } from "./FormikInput.types";

export const FormikInputCustom = <T,>({
  form,
  id,
  accept,
  type,
  ...rest
}: IFormikInputProps<T>) => {
  let error: string | undefined;

  try {
    error = form.touched[id] && (form.errors[id] as string | undefined);
  } catch (e) {
    console.error("Could not get field: ", id, " from form: ", form);
    throw e;
  }
  const fieldProps = form.getFieldProps(id);

  if (type === "file")
    return (
      <InputFile id={id} error={error} {...fieldProps} accept={accept} type={type} {...rest} />
    );
  else if (type === "select") return <MySelect id={id} error={error} {...fieldProps} {...rest} />;
  return <Input id={id} error={error} {...fieldProps} accept={accept} type={type} {...rest} />;
};
