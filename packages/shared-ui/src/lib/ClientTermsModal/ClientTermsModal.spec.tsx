import { render } from "@testing-library/react";

import { ClientTermsModal } from "./ClientTermsModal";

test("ClientTermsModal", () => {
  render(
    <ClientTermsModal
      isOpen={true}
      onAccept={() => {}}
      onDownload={() => {}}
      onPrint={() => {}}
      onShare={() => {}}
      onReject={() => {}}
    />
  );
});
