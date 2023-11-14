import React, { Fragment, Suspense } from "react";

import { StyleSheet, View } from "@react-pdf/renderer";

import Filters from "../Filters";
import SimpleTable from "../SimpleTable";
import Title from "../Title";

// Create styles
const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingRight: 30,
    paddingBottom: 10,
    paddingLeft: 30,
  },
});

const ExportTableContent = ({
  columns,
  data,
  tableOptions,
  filters,
  headerColumns = [],
  title = "Transaction List",
}) => {
  console.log(data);
  return (
    <Fragment>
      <View style={styles.content}>
        <Title title={title} />
        {filters && <Filters filters={filters} />}
      </View>
      <Fragment>
        <Suspense fallback={<h1>Loading....</h1>}>
          <SimpleTable
            columns={columns}
            data={data}
            options={tableOptions}
            headerColumns={headerColumns}
          />
        </Suspense>
      </Fragment>
    </Fragment>
  );
};
export default ExportTableContent;
