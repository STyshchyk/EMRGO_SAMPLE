import { mockedUser } from "@emrgo-frontend/constants";
import { render } from "@testing-library/react";

import { EditCorporateLegalNameModal } from "./EditCorporateLegalNameModal";

test("EditCorporateLegalNameModal", () => {
  render(<EditCorporateLegalNameModal user={mockedUser} />);
});
