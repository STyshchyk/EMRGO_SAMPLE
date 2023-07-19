import { forwardRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import PDFExporter from '../PDFExporter';
import regionSwitcher from '../../helpers/regions';

const ReportingTablePDFExporter = forwardRef(({ children, title, pageSize, orientation }, ref) => {
  const { t } = useTranslation(['reports']);

  return (
    <PDFExporter
      ref={ref}
      title={title}
      options={{
        disclaimer: regionSwitcher({
          ae: t('reports:PlainDisclaimerTextDIFC'),
          sa: t('reports:PlainDisclaimerTextKSA'),
        }),
        pageSize,
        orientation,
      }}
    >
      <Fragment>{children}</Fragment>
    </PDFExporter>
  );
});

export default ReportingTablePDFExporter;
