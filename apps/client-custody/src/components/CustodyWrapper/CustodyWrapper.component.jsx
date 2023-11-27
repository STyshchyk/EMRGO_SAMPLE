import { TermsModal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useCustodyWrapperContext } from "./CustodyWrapper.provider";

export const CustodyWrapperComponent = ({ children }) => {
  const { user, onAcceptClientTerms, onRejectClientTerms, showTermsModal, termsDocumentURL } =
    ensureNotNull(useCustodyWrapperContext());

  const hasAcceptedClientTerms = user?.hasAcceptedClientTerms;

  return (
    <>
      {children}
      <TermsModal
        title="Client Terms"
        subtitle={!hasAcceptedClientTerms ? "Please accept our client terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={showTermsModal === "client_terms"}
        onAccept={onAcceptClientTerms}
        onReject={onRejectClientTerms}
        // hasAccepted={hasAcceptedClientTerms}
        type={showTermsModal}
        hasAccepted={false}
      />
    </>
  );
};
