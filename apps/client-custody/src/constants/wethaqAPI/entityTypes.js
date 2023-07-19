// USER ROLES
import i18n from '../../i18n';

export default [
  { label: i18n.language === 'ar-SA' ? 'الجهة المنظمة' : 'Arranger', value: 'ARRANGER' },
  { label: i18n.language === 'ar-SA' ? 'الملتزم' : 'Obligor', value: 'OBLIGOR' },
  { label: i18n.language === 'ar-SA' ? 'المستثمر' : 'Investor', value: 'INVESTOR' },
  { label: i18n.language === 'ar-SA' ? 'المستشار القانوني' : 'Legal Counsel', value: 'LEGAL_COUNSEL' },
  { label: i18n.language === 'ar-SA' ? 'المستشار القانوني' : 'Broker', value: 'BROKER' },
];
