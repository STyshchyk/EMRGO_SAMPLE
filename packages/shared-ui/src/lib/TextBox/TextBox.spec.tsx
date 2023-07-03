import { render } from "@testing-library/react";

import TextBox from "./TextBox";

describe("TextBox", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<TextBox />);
    expect(baseElement).toBeTruthy();
  });
});
