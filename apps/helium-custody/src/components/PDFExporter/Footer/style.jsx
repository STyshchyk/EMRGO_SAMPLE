import { StyleSheet } from "@react-pdf/renderer";

const primary = "#23389c";
const secondary = "#28ccbf";

const styles = StyleSheet.create({
  disclaimer_content: {
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 0,
    paddingLeft: 20,
    flexDirection: "row",
  },
  disclaimer: {
    height: 25,
    width: "800",
  },
  disclaimer_text: {
    fontSize: "6px",
    color: primary,
  },
  content: {
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    flexDirection: "row",
  },
  block_half: {
    height: 20,
    width: 400,
  },
  logo_W: {
    height: 15,
    width: 55,
  },
  details_wrapper: {
    display: "flex",
    flexDirection: "row",
    width: 375,
    marginTop: "5px",
    justifyContent: "space-between",
  },
  letterhead_text: {
    fontSize: "8px",
    textAlign: "right",
    color: primary,
  },
  divider_wrapper: {
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: "row",
  },
  divider: {
    height: 1,
    width: "100%",
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: secondary,
  },
});

export default styles;
