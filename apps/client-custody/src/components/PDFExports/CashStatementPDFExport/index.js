import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const CashStatementPDFExport = ({ data }) => (
  <Fragment>
    <View style={styles.section}>
      <Text>Section #1 {data?.date}</Text>
    </View>
    <View style={styles.section}>
      <Text>Section #2</Text>
    </View>
  </Fragment>
);

export default CashStatementPDFExport;
