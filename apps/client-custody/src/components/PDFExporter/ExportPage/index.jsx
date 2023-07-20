import { Fragment } from "react";

import { Page, View } from "@react-pdf/renderer";

import CustomLetterhead from "../CustomLetterhead";
import Footer from "../Footer";
import LetterHead from "../LetterHead";
import styles from "./style";

const ExportPage = ({ options, children }) => {
  const {
    hideLetterHead,
    customLetterHeadImagePath,
    disclaimer,
    pageSize = "A4",
    orientation = "landscape",
  } = options;

  return (
    <Page size={pageSize} orientation={orientation} style={styles.page}>
      <View style={styles.header} fixed>
        {hideLetterHead ? (
          <CustomLetterhead customLetterHeadImagePath={customLetterHeadImagePath} />
        ) : (
          <LetterHead />
        )}
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
    customLetterHeadImagePath: "",
  },
};

export default ExportPage;
