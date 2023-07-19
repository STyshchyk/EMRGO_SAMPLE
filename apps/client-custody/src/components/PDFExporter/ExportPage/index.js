import { Fragment } from 'react';
import { Page, View } from '@react-pdf/renderer';

import styles from './style';

import LetterHead from '../LetterHead';
import CustomLetterhead from '../CustomLetterhead';
import Footer from '../Footer';

const ExportPage = ({ options, children }) => {
  const { hideLetterHead, customLetterHeadImagePath, disclaimer, pageSize = 'A4', orientation = 'landscape' } = options;

  return (
    <Page size={pageSize} orientation={orientation} style={styles.page}>
      <View style={styles.header} fixed>
        {hideLetterHead ? <CustomLetterhead customLetterHeadImagePath={customLetterHeadImagePath} /> : <LetterHead />}
      </View>

      <Fragment>{children}</Fragment>

      <View style={styles.footer} fixed>
        <Footer disclaimer={disclaimer} />
      </View>
    </Page>
  );
};

ExportPage.defaultProps = {
  options: {
    hideLetterHead: false,
    customLetterHeadImagePath: '',
  },
};

export default ExportPage;
