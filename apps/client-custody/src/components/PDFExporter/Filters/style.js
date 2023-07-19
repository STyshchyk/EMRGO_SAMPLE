import { StyleSheet } from '@react-pdf/renderer';

const primary = '#23389c';
const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
    flexDirection: 'column',
    // alignItems: 'flex-end',
  },
  // filter: { width: 600 },
  label: { fontSize: '9px', color: primary, marginTop: '5px' },
  value: { fontSize: '9px', fontWeight: 700, color: primary },
});

export default styles;
