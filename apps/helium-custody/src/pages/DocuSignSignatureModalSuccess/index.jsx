import { useTranslation } from "react-i18next";

import { mdiCheckCircleOutline } from "@mdi/js";
// import Button from '../../components/Button';
import Button from "@mui/material/Button";

import ErrorBanner from "../../components/ErrorBanner";
import style from "./style.module.scss";

const DocuSignSignatureModalSuccess = () => {
  const { t } = useTranslation(["docusign"]);
  const closeIframe = () => {
    window.parent.postMessage(t("docusign:Close Modal"), "*");
  };

  return (
    <div className={style.container}>
      <div className={style.success}>
        <ErrorBanner
          title={t("Thank you for providing your input")}
          description=""
          icon={mdiCheckCircleOutline}
        />
        <span className={style.success__descriptor}>
          {t(
            "docusign:Your response has been logged and will be used in the Sukuk issuance process"
          )}
          .
          <br />
          <br />
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeIframe();
              }}
            >
              {t("docusign:Close")}
            </Button>
          </div>
        </span>
      </div>
    </div>
  );
};

DocuSignSignatureModalSuccess.propTypes = {};

export default DocuSignSignatureModalSuccess;
