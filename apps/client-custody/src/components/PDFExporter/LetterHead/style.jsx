import { StyleSheet } from "@react-pdf/renderer";

const primary = "#23389c";
const secondary = "#28ccbf";

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingRight: 40,
    paddingBottom: 10,
    paddingLeft: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  block_half: {
    height: 50,
    width: 400,
  },
  logo_wrapper: {
    height: 40,
    width: 200,
  },
  logo_W: {
    height: 40,
    marginLeft: "-15px",
    width: 120,
  },
  logo_header: {
    fontSize: "12px",
    marginTop: "5px",
    color: primary,
    textAlign: "left",
    width: 200,
    fontWeight: 700,
    fontFamily: "D-DIN Exp",
  },
  logo_subheader: {
    fontSize: "9px",
    marginTop: "5px",
    color: primary,
    textAlign: "left",
    width: 200,
    fontFamily: "D-DIN Exp",
  },
  details_wrapper: {
    display: "flex",
    flexDirection: "row",
    // width: 375,
    marginTop: "5px",
    // justifyContent: 'space-between',
  },
  letterhead_text: {
    fontSize: "8px",
    marginTop: "1px",
    paddingRight: "20px",
    textAlign: "right",
    fontFamily: "D-DIN Exp",
    width: 375,
  },
  letterhead_icon: {
    height: 10,
    // marginLeft: '20px',
  },
  divider_wrapper: {
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: "row",
  },
  divider: {
    height: 1,
    width: "100%",
    // width: 900,
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: secondary,
  },
});

export default styles;
