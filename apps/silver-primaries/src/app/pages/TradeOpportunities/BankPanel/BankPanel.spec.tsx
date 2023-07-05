import { render } from "@testing-library/react";

import { BankPanel } from "./BankPanel";

test("BankPanel", () => {
  render(
    <BankPanel
      bank={{
        bankId: 1,
        name: "Bank",
        logo: "sdadsa",
        opportunities: [],
      }}
    />
  );
});
