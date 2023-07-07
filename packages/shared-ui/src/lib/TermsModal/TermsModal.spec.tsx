import { render } from "@testing-library/react";

import { TermsModal } from "./TermsModal";

test("TermsModal", () => {
  render(
    <TermsModal
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
