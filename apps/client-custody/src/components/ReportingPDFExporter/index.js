import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text } from '@react-pdf/renderer';

import PDFExporter from '../PDFExporter';
import regionSwitcher from '../../helpers/regions';

const primary = '#23389c';

const pdfStyles = StyleSheet.create({
  title: { fontSize: '18px', fontFamily: 'D-DIN Exp', color: primary },
  outerWrapper: {
    paddingTop: 5,
    paddingRight: 30,
    paddingBottom: 10,
    paddingLeft: 30,
  },
  innerWrapper: {
    paddingTop: 10,
    paddingBottom: 25,
    flexDirection: 'row',
  },
  content: { width: 600, paddingBottom: 20 },
  label: { fontSize: '9px', fontFamily: 'D-DIN Exp', color: primary, marginTop: '5px' },
  value: { fontSize: '9px', fontFamily: 'D-DIN Exp', fontWeight: 700, color: primary },
});

const ReportingPDFExporter = forwardRef(({ children }, ref, title) => {
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
      }}
    >
      <View style={pdfStyles.outerWrapper}>
        <Text style={pdfStyles.title}>{title}</Text>
        <View style={pdfStyles.innerWrapper}>
          <View style={pdfStyles.content}>{children}</View>
        </View>
      </View>
    </PDFExporter>
  );
});

export default ReportingPDFExporter;
