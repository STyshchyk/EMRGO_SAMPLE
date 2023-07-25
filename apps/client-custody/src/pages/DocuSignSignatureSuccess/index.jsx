import { useTranslation } from "react-i18next";

import { mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

import style from "./style.module.scss";

// TODO - MOVE THIS INTO DocuSignSignature component
const DocuSignSignatureSuccess = () => {
  const { t } = useTranslation(["docusign"]);
  return (
    <div className={style.container}>
      <div className={style.success}>
        <div className={style.success__icon__wrapper}>
          <Icon
            className={style.success__icon}
            path={mdiCheckCircleOutline}
            size={8}
            title={t("docusign:Action Complete")}
          />
        </div>
        <span className={style.success__descriptor}>
          {t("docusign:Thank you for providing your input")}. <br />
          <br />
          {t(
            "docusign:Your response has been logged and will be used in the Sukuk issuance process"
          )}
          .
        </span>
      </div>
    </div>
  );
};

export default DocuSignSignatureSuccess;
