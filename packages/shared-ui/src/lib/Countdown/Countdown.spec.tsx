import { render } from "@testing-library/react";

import { Button } from "./Countdown";

describe("Button", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Button />);
    expect(baseElement).toBeTruthy();
  });
});
