import { StyleSheet } from "@react-pdf/renderer";

const secondary = "#28ccbf";

const styles = StyleSheet.create({
  content: {
    paddingBottom: 10,
    flexDirection: "row",
  },
  block: {
    height: 100,
    width: 600,
  },
  letterhead_wrapper: {
    width: 600,
  },
  letterhead: {
    width: 600,
  },
  divider_wrapper: {
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: "row",
  },
  divider: {
    height: 1,
    width: 700,
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: secondary,
  },
});

export default styles;
