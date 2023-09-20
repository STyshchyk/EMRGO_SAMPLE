import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { TFASupportTicketModal } from "./TFASupportTicketModal";

test("TFASupportTicketModal", () => {
  render(<TFASupportTicketModal />);
});
