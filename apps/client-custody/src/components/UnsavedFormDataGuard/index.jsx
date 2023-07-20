import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import RouteLeavingGuard from "../RouteLeavingGuard";

const UnsavedFormDataGuard = ({ dirty }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["components"]);

  return (
    <RouteLeavingGuard
      when={dirty}
      title={t("UnsavedFormDataGuard.title")}
      message={t("UnsavedFormDataGuard.message")}
      navigate={(location) => navigate(location)}
      shouldBlockNavigation={() => true}
    />
  );
};

export default UnsavedFormDataGuard;

UnsavedFormDataGuard.propTypes = {
  dirty: PropTypes.bool.isRequired,
};
