import { MyInput } from "../MyInput";
import { IMyTextArea } from "./MyTextArea.types";

export const MyTextArea = <T, >({ form, id, accept, maxWidth, type, ...rest }: IMyTextArea<T>) => {
  let error: string | undefined;

  try {
    error = form.touched[id] && (form.errors[id] as string | undefined);
  } catch (e) {
    console.error("Could not get field: ", id, " from form: ", form);
    throw e;
  }

  const fieldProps = form.getFieldProps(id);

  return <MyInput id={id} error={error} {...fieldProps} accept={accept} type={type} maxWidth={maxWidth} {...rest} />;
};
