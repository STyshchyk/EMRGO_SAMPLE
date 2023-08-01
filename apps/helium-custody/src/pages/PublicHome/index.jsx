import { useTranslation } from "react-i18next";

import style from "./style.module.scss";

const PublicHome = () => {
  const { t } = useTranslation(["translation"]);

  return (
    <div className={style.container}>
      <h2>{t("translation:PublicHome.Welcome to Emrgo Portal")}</h2>
    </div>
  );
};

export default PublicHome;
