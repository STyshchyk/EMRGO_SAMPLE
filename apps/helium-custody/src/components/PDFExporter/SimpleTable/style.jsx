import { StyleSheet } from "@react-pdf/renderer";

const primary = "#23389c";

const styles = StyleSheet.create({
  header: {
    color: "#FFF",
    fontSize: "10px",
    backgroundColor: primary,
    borderRight: "1px solid white",
    paddingLeft: "2px",
    fontFamily: "D-DIN Exp",
    fontWeight: 700,
  },
  header_none: {
    display: "none",
  },
  cell: {
    color: primary,
    paddingTop: "3px",
    paddingBottom: "1px",
    paddingLeft: "2px",
    fontSize: "8px",
    height: "100%",
    fontFamily: "D-DIN Exp",
    // backgroundColor: 'gray',
  },
  text: {
    color: "red",
  },
  tableWrapper: {
    paddingTop: 5,
    paddingRight: 30,
    paddingBottom: 10,
    paddingLeft: 30,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: primary,
    color: "#ffffff",
    textAlign: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 500,
    padding: "8px 4px 4px 4px",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 10,
    padding: "8px 4px 4px 4px",
    fontWeight: 400,
    fontFamily: "NotoSansArabic",
  },
});

export default styles;
