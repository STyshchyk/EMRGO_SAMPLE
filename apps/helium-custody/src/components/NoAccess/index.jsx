import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import routes from "../../constants/routes";

const useQuery = () => new URLSearchParams(useLocation().search);

const NoAccess = () => {
  const query = useQuery();
  const { t } = useTranslation(["translation"]);
  return (
    <Fragment>
      <h2>{t("translation:Access Denied.Access Denied")}</h2>
      <Fragment>
        <p>
          {t("translation:Access Denied.You dont have permission to view this page at", {
            referrer: query.get("referrer"),
          })}
        </p>
        <Link
          to={routes.dashboard.home}
          className="nav-link nav-link--primary nav-link--no-padding"
        >
          {t("translation:Access Denied.Back to Dashboard")}
        </Link>
      </Fragment>
    </Fragment>
  );
};

export default NoAccess;
