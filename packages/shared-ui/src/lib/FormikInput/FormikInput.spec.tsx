import { render } from "@testing-library/react";

import { FormikInput } from "./formik-input";

describe("FormikInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FormikInput />);
    expect(baseElement).toBeTruthy();
  });
});
