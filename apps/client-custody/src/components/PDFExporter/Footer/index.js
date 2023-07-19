import { Text, View, Image } from '@react-pdf/renderer';

import styles from './style';

const i18nextLng = localStorage.getItem('i18nextLng');
const setFontFamily = i18nextLng === 'ar-SA' ? 'NotoSansArabic' : 'D-DIN Exp';

const Footer = ({ disclaimer }) => (
  <View>
    <View style={styles.divider_wrapper}>
      <View style={styles.divider}></View>
    </View>
    {disclaimer ? (
      <View style={styles.disclaimer_content}>
        <View style={[styles.disclaimer]}>
          <Text style={[styles.disclaimer_text]}>{disclaimer}</Text>
        </View>
      </View>
    ) : (
      <View></View>
    )}

    <View style={styles.content}>
      <View style={[styles.block_half]}>
        <View style={[styles.logo]}>
          <Image style={styles.logo_W} src="/export/emrgo_logo.png" />
        </View>
      </View>
      <View style={[styles.block_half]}>
        <View style={styles.details_wrapper}>
          <Text style={styles.letterhead_text} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </View>
    </View>
  </View>
);

export default Footer;
