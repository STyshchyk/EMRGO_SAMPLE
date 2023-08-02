import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: "auto",
  },
});

export default styles;
