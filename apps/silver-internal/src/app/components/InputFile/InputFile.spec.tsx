import { render } from "@testing-library/react";

import { InputFile } from "./InputFile";

describe("Input", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<InputFile label="" />);
    expect(baseElement).toBeTruthy();
  });
});
