import { render } from "@testing-library/react";

import { MyInput } from "./MyInput";

test("MyInput", () => {
  render(<MyInput value="" onChange={() => {console.log("");}} label="" />);
});
