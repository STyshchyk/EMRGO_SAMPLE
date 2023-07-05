import { render } from "@testing-library/react";
import { useFormik } from "formik";

import { MyTextArea } from "./MyTextArea";

test("MyTextArea", () => {
  const mockFormik = useFormik({ initialValues: { test: "" }, onSubmit: () => {} });

  render(<MyTextArea<{ test: string }> form={mockFormik} id="test" label={""} accept={""} />);
});
