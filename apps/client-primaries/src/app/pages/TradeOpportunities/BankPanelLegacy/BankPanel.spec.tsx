import { render } from "@testing-library/react";

import { BankPanel } from "./BankPanel";

test("BankPanel", () => {
  render(
    <BankPanel
      bank={{
        id: 1,
        name: "Bank",
        logo: {
          light: "",
          dark: "",
        },
        issuances: [],
      }}
    />
  );
});
