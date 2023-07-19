import { Text, View } from '@react-pdf/renderer';
import shortid from 'shortid';

import styles from './style';

const i18nextLng = localStorage.getItem('i18nextLng');
const setFontFamily = i18nextLng === 'ar-SA' ? 'NotoSansArabic' : 'D-DIN Exp';

const Filters = ({ filters, styleProps = {} }) => {
  const { contentPaddingBottom = 10 } = styleProps;

  const FALLBACK_VALUE = '--';

  return (
    <View>
      <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
        {filters.map((filter) => (
          <Text style={[styles.label, { fontFamily: setFontFamily }]} key={shortid.generate()}>
            {filter.label ? `${filter.label}:` : ''} <Text style={styles.value}>{!filter.value ? FALLBACK_VALUE : filter.value}</Text>
            {/* <Text style={styles.value}>{filter.value}</Text> {filter.label ? ` : ${filter.label}` : ''} */}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default Filters;
