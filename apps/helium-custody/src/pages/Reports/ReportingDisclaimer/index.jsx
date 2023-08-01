import { Fragment } from "react";
import { Trans } from "react-i18next";

import Typography from "@mui/material/Typography";

import RegionSwitch from "../../../components/RegionSwitch";

const TextWrapper = ({ children }) => (
  <Typography
    variant="caption"
    color="textSecondary"
    style={{
      paddingBottom: "1rem",
    }}
  >
    {children}
  </Typography>
);

const KSATextTemplate = () => (
  <TextWrapper>
    <Trans i18nKey="reports:TemplateDisclaimerTextKSA">
      Disclaimer: This is a computer-generated report and therefore does not require an authorized
      signature from Emrgo Capital Platform JSC (the “Custodian”). The information in this report is
      private and confidential and addressed solely to the Account holder. In case of any
      discrepancy, please advise the Custodian via email (
      <a target="_blank" rel="noreferrer" href="mailto:solutions@wethaqcapital.sa">
        securitiesservices@wethaqcapital.sa
      </a>
      ) within 30 days of receipt of this report. Failure to notify us constitutes your acceptance
      of this report. The Custodian shall not be liable for any losses arising, directly or
      indirectly, as a result of any instructions provided to the Custodian in connection with this
      report.
    </Trans>
  </TextWrapper>
);

const DIFCTextTemplate = () => (
  <TextWrapper>
    <Trans i18nKey="reports:TemplateDisclaimerTextDIFC">
      Disclaimer: This is a computer-generated report and therefore does not require an authorised
      signature from EMRGO (DIFC) Ltd. (the “Custodian”). The information in this report is private
      and confidential and addressed solely to the Account holder. In case of any discrepancy,
      please advise the Custodian via email (
      <a target="_blank" rel="noreferrer" href="mailto:solutions@difc.emrgo.com">
        solutions@difc.emrgo.com
      </a>
      ) within 24 hours of receipt of this report. Failure to notify us constitutes your acceptance
      of this report. The Custodian shall not be liable for any losses arising, directly or
      indirectly, as a result of any instructions provided by the recipient to the Custodian in
      connection with this report.
    </Trans>
  </TextWrapper>
);

const ReportingDisclaimer = () => (
  <Fragment>
    <hr />
    <RegionSwitch sa={<KSATextTemplate />} ae={<DIFCTextTemplate />} />
  </Fragment>
);

export default ReportingDisclaimer;
