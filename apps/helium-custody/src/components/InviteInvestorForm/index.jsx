import { useState } from "react";
import { useTranslation } from "react-i18next";

import cx from "classnames";
import { Formik } from "formik";
import PropTypes from "prop-types";

import { useTheme } from "../../context/theme-context";
import Checkbox from "../Checkbox";
import UtilCheckbox from "../UtilCheckbox";
import style from "./style.module.scss";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SelectAllButton = ({ onChange, label, checked }) => (
  <div className={style.buttonCheckbox}>
    <UtilCheckbox
      name="investors"
      onClick={() => onChange(!checked)}
      label={label}
      checked={checked}
    />
  </div>
);

SelectAllButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

const InviteInvestorForm = ({ investors, onSubmit }) => {
  const { t } = useTranslation(["investors"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const [selectAll, setSelectAll] = useState(false);

  const getTableRows = (entries) => {
    const rows = [];
    if (!entries || !entries.length) return rows;
    entries.forEach((entry, i) => {
      rows.push(
        <div className={style.tableRow} key={entry.id}>
          <div className={style.rowData}>
            <div className={style.tableCol}>
              <Checkbox label={entry.corporateEntityName} name={`investors.${i}.isEnabled`} />
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>
                {entry.user
                  ? `${entry.user.firstName || ""} ${entry.user.middleName || ""} ${
                      entry.user.lastName || ""
                    }`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      );
    });
    return rows;
  };

  const buildRequestPayload = (values, initialSelected) => {
    const investorIds = [];
    initialSelected.forEach((entry) => {
      if (entry.isEnabled) {
        investorIds.push(entry.id);
      }
    });
    values.investors.forEach((val) => {
      const index = investorIds.indexOf(val.id);
      if (val.isEnabled && index === -1) {
        investorIds.push(val.id);
      } else if (!val.isEnabled && index !== -1) {
        investorIds.splice(index, 1);
      }
    });
    return { investors: investorIds };
  };

  const handleSelectAllToggle = (select, setValues) => {
    const selected = [];
    investors.forEach((investor) => {
      selected.push({ ...investor, ...{ isEnabled: select } });
    });
    setValues({ investors: selected }, false);
    setSelectAll(select);
  };

  return (
    <Formik
      initialValues={{ investors }}
      isInitialValid={false}
      enableReinitialize
      onSubmit={async (values, actions) => {
        onSubmit(buildRequestPayload(values, investors));
        await delay(1000);
        actions.setSubmitting(false);
        actions.resetForm();
        setSelectAll(false);
      }}
    >
      {({ handleSubmit, setValues }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={style.issuanceDataTable}>
            <div className={style.tableHeader}>
              <div
                className={cx(
                  style.tableCol,
                  locale.rtl ? style.tableCol__right : style.tableCol__left
                )}
              >
                <p className={style.tableHeading}>{t("investors:Headers.Entity Name")}</p>
              </div>
              <div className={style.tableCol}>
                <p className={style.tableHeading}>{t("investors:Headers.Name")}</p>
              </div>
            </div>
            <div className={style.tableBody}>{getTableRows(investors)}</div>
          </div>
          <SelectAllButton
            onChange={(select) => handleSelectAllToggle(select, setValues)}
            label={selectAll ? t("investors:Unselect All") : t("investors:Select All")}
            checked={selectAll}
          />
          <input
            type="submit"
            value={t("investors:Invite Investors")}
            className={cx("btn btn--primary btn--thin", style.block)}
          />
        </form>
      )}
    </Formik>
  );
};

InviteInvestorForm.propTypes = {
  investors: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

InviteInvestorForm.defaultProps = {};

export default InviteInvestorForm;
