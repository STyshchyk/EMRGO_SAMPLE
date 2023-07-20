/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { capitalCase, titleCase } from "change-case";
import cx from "classnames";
import { reverse } from "named-urls";

import Button from "../../components/Button";
import CreateIssuanceForm from "../../components/CreateIssuanceForm";
import Flex from "../../components/Flex";
import LoadingPage from "../../components/LoadingPage";
import MinorNavigation from "../../components/MinorNavigation";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import { useTheme } from "../../context/theme-context";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as authSelectors from "../../redux/selectors/auth";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import style from "./style.module.scss";

const IssuancesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation(["translation", "issuances", "statuses"]);
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const issuances = useSelector(issuanceSelectors.selectListOfIssuanceObjects);
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const clients = useSelector(issuanceSelectors.selectIssuerClients);
  const coArrangers = useSelector(issuanceSelectors.selectCoArrangers);
  const isFetchingIssuances = useSelector(issuanceSelectors.selectIsFetchingIssuances);
  const hasCreateIssuanceACL = currentListOfAcls.includes(accessControlsList.ISSUANCE.create.key);
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const ROUTES = [
    {
      link: reverse(routes.dashboard.issuances.home),
      text: "Minor Navigation.Issuance.Ongoing Issuances",
      disabled: false,
    },
  ];

  useEffect(() => {
    const fetchIssuances = (payload) => dispatch(issuanceActionCreators.doFetchIssuances(payload));

    fetchIssuances();
  }, [dispatch, hasCreateIssuanceACL, currentEntityGroupID]);

  useEffect(() => {
    if (hasCreateIssuanceACL) {
      const fetchIssuerClients = (payload) =>
        dispatch(issuanceActionCreators.doFetchIssuerClients(payload));
      const fetchCoArrangers = (payload) =>
        dispatch(issuanceActionCreators.doFetchCoArrangers(payload));
      const fetchFormOptions = (payload) =>
        dispatch(issuanceActionCreators.doFetchFormOptions(payload));

      fetchIssuerClients();
      fetchCoArrangers();
      fetchFormOptions({
        options: ["sukukType", "pricingMethod"],
      });
    }
  }, [dispatch, hasCreateIssuanceACL, currentEntityGroupID]);

  const [openAddIssuanceFormDialog, setOpenAddIssuanceFormDialog] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState([]);

  const handleRowToggle = (rowIndex) => {
    // const currentSelected = [...expandedIndices];
    // const existingIndex = currentSelected.indexOf(rowIndex);
    // if (existingIndex !== -1) {
    //   currentSelected.splice(existingIndex, 1);
    // } else {
    //   currentSelected.push(rowIndex);
    // }
    setExpandedIndices(rowIndex);
  };

  const handleNav = (entry) => {
    navigate(reverse(`${routes.dashboard.issuances.issuance.overview}`, { issuanceID: entry.id }));
  };

  const getTableRows = (entries) => {
    const rows = [];
    if (!entries || !entries.length) return rows;
    entries.forEach((entry, i) => {
      rows.push(
        <div className={style.tableRow} key={entry.id}>
          <div
            className={cx(style.rowData, expandedIndices === i ? style.highlightedRow : "")}
            onClick={() => handleRowToggle(i)}
          >
            <div className={style.tableCol}>
              <p className={style.tableData}>{entry?.wsn ?? "N/A"}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>{entry?.name ?? "N/A"}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>{entry?.obligorName ?? "N/A"}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>
                {t(`statuses:Issuance.Sukuk Types.${entry?.sukukTypeName ?? "N/A"}`)}
              </p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>{convertNumberToIntlFormat(entry?.issuanceAmount)}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>{entry?.currencyName ?? "N/A"}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableData}>{dateFormatter(entry.createdAt, "DD/MM/YYYY")}</p>
            </div>
            <div className={cx(style.tableCol, style.rightAlign)}>
              <p className={cx(style.tableData, style.marginRight)}>
                <PlayCircleOutlineIcon
                  className={cx(theme.locale.rtl && style.rotate180)}
                  color="secondary"
                  onClick={() => handleNav(entry)}
                />
              </p>
            </div>
          </div>
          {expandedIndices === i ? (
            <div className={style.rowDetails}>
              <div className={style.flexRow}>
                <div className={style.dataSection}>
                  <p className={style.dataSectionHeading}>
                    {t("issuances:Accordian.Issuance Information")}
                  </p>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>
                        {t("issuances:Accordian.Offering Method")}:{" "}
                      </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {t(`issuances:Accordian.${entry?.distributionMethodName ?? "N/A"}`)}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>
                        {t("issuances:Accordian.Pricing Method")}:{" "}
                      </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {t(`issuances:Accordian.${entry?.pricingName ?? "N/A"}`)}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Issuer SPV")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={cx(style.sectionValue, style.highlighted)}>
                        {t(
                          `statuses:Issuer.${entry?.issuerSPV || titleCase(entry?.issuerSPVStatus)}`
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Status")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {t(
                          `statuses:Issuance.Private Placement.${
                            capitalCase(entry?.status) ?? "N/A"
                          }`
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>
                        {t(`statuses:Issuance.Engagement Settings.Arranger Counsel Only`)}
                      </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {entry?.hasLegalCounsel
                          ? t("issuances:Accordian.Enabled")
                          : t("issuances:Accordian.Disabled")}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>
                        {t(`statuses:Issuance.Engagement Settings.Obligor Engages Issuer`)}
                      </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {entry?.hasObligorIssuerInvite
                          ? t("issuances:Accordian.Enabled")
                          : t("issuances:Accordian.Disabled")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={style.dataSection}>
                  <p className={style.dataSectionHeading}>
                    {t("issuances:Accordian.Trade Information")}
                  </p>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Trade Date")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {dateFormatter(entry.tradeDate, "DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Issue Date")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {dateFormatter(entry.issueDate, "DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={style.dataSection}>
                  <p className={style.dataSectionHeading}>
                    <br />
                  </p>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Created On")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {dateFormatter(entry.createdAt, "DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className={style.flexRow}>
                    <div className={style.sectionLabelContainer}>
                      <p className={style.sectionLabel}>{t("issuances:Accordian.Modified On")}: </p>
                    </div>
                    <div className={style.sectionValueContainer}>
                      <p className={style.sectionValue}>
                        {dateFormatter(entry.updatedAt, "DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
    return rows;
  };

  if (isFetchingIssuances) {
    return <LoadingPage />;
  }

  return (
    <div>
      <Flex justify="between">
        <MinorNavigation routes={ROUTES} />
        {hasCreateIssuanceACL && (
          <div>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={() => setOpenAddIssuanceFormDialog(!openAddIssuanceFormDialog)}
              data-testid="new-issuance-btn"
            >
              {t("issuances:New Issuance +")}
            </Button>
            <CreateIssuanceForm
              formOptions={{
                clients,
                coArrangers,
                sukukType: formOptions?.sukukType || [],
                pricingMethod: formOptions?.pricingMethod || [],
              }}
              open={openAddIssuanceFormDialog}
              handleClose={() => {
                setOpenAddIssuanceFormDialog(false);
              }}
              entityGroupId={currentEntityGroup?.id}
            />
          </div>
        )}
      </Flex>
      <div className={style.issuanceListContainer}>
        <div className={style.issuanceDataTable}>
          <div className={style.tableHeader}>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:WSN")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Issuance Name")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Obligor")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Sukuk Type")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Issuance Amount")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Currency")}</p>
            </div>
            <div className={style.tableCol}>
              <p className={style.tableHeading}>{t("issuances:Created On")}</p>
            </div>
            <div className={style.tableCol} />
          </div>
          <div className={style.tableBody} data-testid="issuances-list">
            {getTableRows(issuances)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuancesList;
