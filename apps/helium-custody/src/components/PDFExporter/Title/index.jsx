import { Text, View } from "@react-pdf/renderer";

import styles from "./style";

const i18nextLng = localStorage.getItem("i18nextLng");
const setFontFamily = i18nextLng === "ar-SA" ? "NotoSansArabic" : "D-DIN Exp";
const setJustifyContent = i18nextLng === "ar-SA" ? "flex-end" : "flex-start";

const Title = ({ title }) => (
  <View>
    <View style={[styles.content, { justifyContent: setJustifyContent }]}>
      <Text style={[styles.title, { fontFamily: setFontFamily }]}>{title}</Text>
    </View>
  </View>
);
export default Title;
