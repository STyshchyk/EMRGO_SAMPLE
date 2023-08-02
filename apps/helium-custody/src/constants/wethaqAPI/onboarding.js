// USER ROLES
import i18n from "../../i18n";

export default [
  {
    label: i18n.language === "ar-SA" ? "عميل" : "Client",
    value: "CLIENT",
    roles: [
      { label: i18n.language === "ar-SA" ? "الملتزم" : "Obligor", value: "OBLIGOR" },
      { label: i18n.language === "ar-SA" ? "المستثمر" : "Investor", value: "INVESTOR" },
    ],
  },
  {
    label: i18n.language === "ar-SA" ? "مقدمي خدمات" : "Service Provider",
    value: "SERVICE_PROVIDER",
    roles: [
      { label: i18n.language === "ar-SA" ? "الجهة المنظمة" : "Arranger", value: "ARRANGER" },
      { label: i18n.language === "ar-SA" ? "الجهة المنظمة" : "Co-Arranger", value: "CO_ARRANGER" },
      {
        label: i18n.language === "ar-SA" ? "المستشار القانوني" : "Legal Counsel",
        value: "LEGAL_COUNSEL",
      },
      { label: i18n.language === "ar-SA" ? "المستشار القانوني" : "Broker", value: "BROKER" },
      {
        label: i18n.language === "ar-SA" ? "مقدم خدمات ائتمانية" : "Fiduciary Service Provider",
        value: "FIDUCIARY",
      },
    ],
  },
  {
    label: i18n.language === "ar-SA" ? "Other" : "Other",
    value: "OTHER",
    roles: [{ label: i18n.language === "ar-SA" ? "المُصدر" : "Issuer", value: "ISSUER" }],
  },
];
