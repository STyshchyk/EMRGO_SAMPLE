import { StyleSheet } from "@react-pdf/renderer";

const primary = "#23389c";

const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
  },
  title: { fontSize: "18px", color: primary },
});

export default styles;
