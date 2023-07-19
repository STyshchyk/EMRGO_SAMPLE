import React, { Fragment, Suspense } from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';

import SimpleTable from '../SimpleTable';
import Filters from '../Filters';
import Title from '../Title';

// Create styles
const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingRight: 30,
    paddingBottom: 10,
    paddingLeft: 30,
  },
});

const ExportTableContent = ({ columns, data, tableOptions, filters, headerColumns = [], title = 'Transaction List' }) => (
  <Fragment>
    <View style={styles.content}>
      <Title title={title} />
      {filters && <Filters filters={filters} />}
    </View>
    <Fragment>
      <Suspense fallback={<h1>Loading....</h1>}>
        <SimpleTable columns={columns} data={data} options={tableOptions} headerColumns={headerColumns} />
      </Suspense>
    </Fragment>
  </Fragment>
);
export default ExportTableContent;
