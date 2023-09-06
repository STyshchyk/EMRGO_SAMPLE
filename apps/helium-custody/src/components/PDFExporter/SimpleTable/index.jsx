import { useTranslation } from "react-i18next";

import { Text, View } from "@react-pdf/renderer";
import resolvePath from "object-resolve-path";
import shortid from "shortid";

import styles from "./style";

export const renderExtraHeader = (headerColumns, setFontFamily) => {
  let noOfColumnsLeft = 0;
  let widthLeft = 100;

  headerColumns.map((column) => {
    const { exportConfig = {}, hidden = false } = column;
    const { width = false, colSpan } = exportConfig;
    // console.log(width);

    if (!hidden) {
      if (width) {
        widthLeft -= width;
      } else {
        noOfColumnsLeft += 1;
      }
      if (colSpan) {
        noOfColumnsLeft += 1;
      }
    }
    return false;
  });

  const defaultWidth = widthLeft / noOfColumnsLeft;

  return headerColumns?.map((column) => {
    const { exportConfig = {}, title } = column;
    const { width, colSpan } = exportConfig;

    return (
      <View
        style={[
          styles.tableColHeader,
          {
            width: colSpan
              ? `${width + defaultWidth || defaultWidth + defaultWidth}%`
              : `${width || defaultWidth}%`,
          },
        ]}
        key={shortid.generate()}
      >
        <Text style={[styles.tableCellHeader, { fontFamily: setFontFamily }]}> {title}</Text>
      </View>
    );
  });
};

export const renderTableHeaders = (columns, setFontFamily) => {
  let noOfColumnsLeft = 0;
  let widthLeft = 100;

  columns.map((column) => {
    const { exportConfig = {}, hidden = false } = column;
    const { width = false } = exportConfig;

    if (!hidden) {
      if (width) {
        widthLeft -= width;
      } else {
        noOfColumnsLeft += 1;
      }
    }
    return false;
  });

  const defaultWidth = widthLeft / noOfColumnsLeft;

  return columns.map((column) => {
    const { exportConfig = {}, title, hidden = false } = column;
    const { width } = exportConfig;

    return (
      !hidden && (
        <View
          style={[styles.tableColHeader, { width: `${width || defaultWidth}%` }]}
          key={shortid.generate()}
        >
          <Text style={[styles.tableCellHeader, { fontFamily: setFontFamily }]}> {title}</Text>
        </View>
      )
    );
  });
};

export const renderDataTableCells = (columns, data) => {
  let noOfColumnsLeft = 0;
  let widthLeft = 100;

  columns.map((column) => {
    const { exportConfig = {}, hidden = false } = column;
    const { width = false } = exportConfig;

    if (!hidden) {
      if (width) {
        widthLeft -= width;
      } else {
        noOfColumnsLeft += 1;
      }
    }
    return false;
  });
  const defaultWidth = widthLeft / noOfColumnsLeft;

  const rows = data.map((rowData) => (
    <View style={styles.tableRow} key={shortid.generate()}>
      {columns.map((column) => {
        const { exportConfig = {}, field, hidden = false } = column;
        const { width = false, render = false, align = "left" } = exportConfig;
        const rendered = render ? render(rowData) : resolvePath(rowData, field);
        const isNan = typeof rendered === "number" && isNaN(rendered);
        const outputVal = isNan ? "--" : rendered;
        const size = columns.length >= 10 ? Math.ceil(columns.length / 10) : 0;
        return (
          !hidden && (
            <View
              style={[styles.tableCol, { width: `${width || defaultWidth}%`, textAlign: align }]}
              key={shortid.generate()}
            >
              <Text style={[styles.tableCell, { fontSize: 10 - size }]}>{outputVal}</Text>
            </View>
          )
        );
      })}
    </View>
  ));
  return rows;
};

export const chunk = (array, size, tableOffset) => {
  const chunkedArr = [];
  const copied = [...array]; // ES6 destructuring

  chunkedArr.push(copied.splice(0, tableOffset));

  const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
  for (let i = 0; i < numOfChild; i += 1) {
    chunkedArr.push(copied.splice(0, size));
  }
  return chunkedArr;
};

const SimpleTable = ({ columns, data, options, headerColumns = [] }) => {
  const { sliceRowCount, tableOffset } = options;
  const size = sliceRowCount || 5;
  const slices = chunk(data, size, tableOffset);
  const i18nextLng = localStorage.getItem("i18nextLng");
  const setFontFamily = i18nextLng === "ar-SA" ? "NotoSansArabic" : "D-DIN Exp";
  const { t } = useTranslation(["counterparty"]);

  const filteredHeaderColumns = headerColumns?.filter((val) => val);

  return (
    <>
      {slices.map((slice, index) => (
        <View wrap={false} style={styles.tableWrapper} key={shortid.generate()} break={index !== 0}>
          <View style={[styles.table]}>
            {filteredHeaderColumns.length > 0 && (
              <View style={styles.tableRow}>
                {renderExtraHeader(filteredHeaderColumns, setFontFamily)}
              </View>
            )}
            <View style={styles.tableRow}>{renderTableHeaders(columns, setFontFamily)}</View>
            {renderDataTableCells(columns, slice, options)}
          </View>
        </View>
      ))}
    </>
  );
};

export default SimpleTable;
