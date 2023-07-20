import { Image, View } from "@react-pdf/renderer";

import styles from "./style";

const CustomLetterhead = ({ customLetterHeadImagePath }) => (
  <View>
    <View style={styles.content}>
      <View style={[styles.block]}>
        {customLetterHeadImagePath && (
          <View style={[styles.letterhead_wrapper]}>
            <Image style={styles.letterhead} src={customLetterHeadImagePath} />
          </View>
        )}
      </View>
    </View>
    <View style={styles.divider_wrapper}>
      <View style={styles.divider}></View>
    </View>
  </View>
);

export default CustomLetterhead;
