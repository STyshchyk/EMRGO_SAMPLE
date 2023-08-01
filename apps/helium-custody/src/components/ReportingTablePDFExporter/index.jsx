import { forwardRef, Fragment } from "react";
import { useTranslation } from "react-i18next";

import regionSwitcher from "../../helpers/regions";
import PDFExporter from "../PDFExporter";

const ReportingTablePDFExporter = forwardRef(({ children, title, pageSize, orientation }, ref) => {
  const { t } = useTranslation(["reports"]);

  return (
    <PDFExporter
      ref={ref}
      title={title}
      options={{
        disclaimer: regionSwitcher({
          ae: t("reports:PlainDisclaimerTextDIFC"),
          sa: t("reports:PlainDisclaimerTextKSA"),
        }),
        pageSize,
        orientation,
      }}
    >
      {children}
    </PDFExporter>
  );
});

export default ReportingTablePDFExporter;
