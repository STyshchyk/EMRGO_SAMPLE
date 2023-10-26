import { render } from "@testing-library/react";

import { HelpModal } from "./HelpModal";

test("HelpModal", () => {
  render(
    <HelpModal
      isOpen={true}
      documentURL=""
      onAccept={() => {}}
      // onDownload={() => {}}
      // onPrint={() => {}}
      // onShare={() => {}}
      onReject={() => {}}
    />
  );
});
