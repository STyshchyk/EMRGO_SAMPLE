import { render } from "@testing-library/react";

import { OpportunityStatusLabel } from "./OpportunityStatusLabel";

test("OpportunityStatusLabel", () => {
  render(<OpportunityStatusLabel status="idea" />);
});
