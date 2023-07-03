import { render } from "@testing-library/react";

import { OnboardedUserTable } from "./OnboardedUserTable";

test("OnboardedUserTable", () => {
  render(<OnboardedUserTable onboarderUsers={[]} />);
});
