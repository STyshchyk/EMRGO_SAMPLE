import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import PropTypes from "prop-types";
import shortid from "shortid";

import * as issuanceSelectors from "../../../redux/selectors/issuance";
import style from "./style.module.scss";

const StatusText = ({ text }) => {
  const { t } = useTranslation(["overview", "statuses"]);
  const statusClass = "success"; // get this on basis of status
  return <span className={style[statusClass]}>{t(`overview:Statuses.${text}`)}</span>;
};

StatusText.propTypes = {
  text: PropTypes.string.isRequired,
};

const DataTable = ({ headers, rows, sectionHeader }) => {
  const { t } = useTranslation(["statuses"]);

  const getHeadings = (headings) => {
    const cells = [];
    headings.forEach((heading) => {
      cells.push(
        <div className={style.tableCol} key={shortid.generate()}>
          <Typography className={style.tableHeading}>{heading}</Typography>
        </div>
      );
    });
    return cells;
  };

  const getDataRows = (data) => {
    const dataRows = [];
    data.forEach((rowData) => {
      dataRows.push(
        <div className={style.tableRow} key={shortid.generate()}>
          <div className={style.rowData}>
            <div className={style.tableCol}>
              <p className={style.tableData}>{rowData.corporateEntityName}</p>
            </div>
            {/* <div className={style.tableCol}>
              <p className={style.tableData}>{`${rowData.name?.firstName || ''} ${rowData.name?.middleName || ''} ${rowData.name?.lastName || ''}`}</p>
            </div> */}
            <div className={style.tableCol}>
              {sectionHeader === "Service Providers" && (
                <p className={style.tableData}>
                  {t(
                    `statuses:Users.${
                      rowData.entityType === "FIDUCIARY"
                        ? "SPE Trustee"
                        : capitalCase(rowData.entityType)
                    }`
                  )}
                </p>
              )}
            </div>
            <div className={style.tableCol}>
              {/* <p className={style.tableData}>{t(`statuses:Users.${rowData.entityType ? capitalCase(rowData.entityType) : ''}`)}</p> */}
              {sectionHeader === "Service Providers" ? (
                <p className={style.tableData}>
                  {t(
                    `statuses:Users.${
                      rowData.hiredByEntityType === "FIDUCIARY"
                        ? "SPE Trustee"
                        : capitalCase(rowData.hiredByEntityType)
                    }`
                  )}
                </p>
              ) : (
                <p className={style.tableData}>
                  {t(
                    `statuses:Users.${
                      rowData.entityType === "FIDUCIARY"
                        ? "SPE Trustee"
                        : capitalCase(rowData.entityType)
                    }`
                  )}
                </p>
              )}
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>
                <StatusText text={rowData.status ? capitalCase(rowData.status) : ""} />
              </p>
            </div>
          </div>
        </div>
      );
    });
    return dataRows;
  };

  return (
    <div className={style.issuanceDataTable}>
      <div className={style.tableHeader}>{getHeadings(headers)}</div>
      <div className={style.tableBody}>{getDataRows(rows)}</div>
    </div>
  );
};

DataTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Overview = () => {
  const overview = useSelector(issuanceSelectors.selectIssuanceOverview);
  const message = useSelector(issuanceSelectors.selectMessage);
  const { t } = useTranslation(["translation", "overview", "statuses"]);

  return (
    <div className={style.issuanceOverview}>
      {message === "Forbidden" ? (
        <h1>{t("overview:Sukuk details are not available right now!")}</h1>
      ) : (
        <div>
          <h3 className={style.sectionHeading}>{t("overview:Obligor")}</h3>
          <DataTable
            headers={[t("overview:Headers.Entity Name"), "", t("overview:Headers.Position"), ""]}
            rows={
              overview?.projectTeam
                ? overview?.projectTeam.filter((entry) => entry?.entityType === "OBLIGOR")
                : []
            }
          />
          <h3 className={style.sectionHeading}>{t("overview:Issuer SPV")}</h3>
          {overview?.issuerSPVStatus === "pendingInstructions" ? (
            t("overview:Details Pending")
          ) : (
            <DataTable
              headers={[t("overview:Headers.Entity Name"), "", "", t("overview:Headers.Status")]}
              rows={[{ corporateEntityName: overview?.issuerSPV, status: "Incorporated" }]}
            />
          )}
          <h3 className={style.sectionHeading}>
            {t("statuses:Users.Arranger", {
              count: overview?.projectTeam
                ? overview?.projectTeam.filter((entry) => entry?.entityType === "ARRANGER").length
                : [].length,
            })}
          </h3>
          <DataTable
            headers={[t("overview:Headers.Entity Name"), "", t("overview:Headers.Position"), ""]}
            rows={
              overview?.projectTeam
                ? overview?.projectTeam.filter((entry) => entry?.entityType === "ARRANGER")
                : []
            }
          />
          <h3 className={style.sectionHeading}>
            {t("statuses:Users.Capital Market Institution", {
              count: overview?.projectTeam
                ? overview?.projectTeam.filter((entry) => entry?.entityType === "CO_ARRANGER")
                    .length
                : [].length,
            })}
          </h3>
          <DataTable
            headers={[t("overview:Headers.Entity Name"), "", t("overview:Headers.Position"), ""]}
            rows={
              overview?.projectTeam
                ? overview?.projectTeam.filter((entry) => entry?.entityType === "CO_ARRANGER")
                : []
            }
          />
          <h3 className={style.sectionHeading}>{t("overview:Service Providers")}</h3>
          <DataTable
            headers={[
              t("overview:Headers.Entity Name"),
              t("overview:Headers.Service Type"),
              t("overview:Headers.Position"),
              t("overview:Headers.Status"),
            ]}
            rows={overview?.providers || []}
            sectionHeader={"Service Providers"}
          />
        </div>
      )}
    </div>
  );
};

export default Overview;
