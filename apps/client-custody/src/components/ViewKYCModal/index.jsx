import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import { reverse } from "named-urls";

import routes from "../../constants/routes";
import { useTheme } from "../../context/theme-context";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../redux/actionCreators/kyc";
import * as authSelectors from "../../redux/selectors/auth";
import * as kycSelectors from "../../redux/selectors/kyc";
import { getDropdownValues } from "../../utils/form";
import { dateFormatter } from "../../utils/formatter";

const ViewKYCModal = ({ entityId, rowData, open, onClose }) => {
  const { t } = useTranslation(["kyc"]);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { locale } = theme;
  // const { userStatus, userTimeline } = kycData;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const paymentAccounts = useSelector(kycSelectors.selectPaymentAccounts);
  const isFetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    if (entityId) {
      dispatch(
        kycActionCreators.doFetchKYCData({
          entityId,
          requestPayload: {
            keys: [
              "entityType",
              "registeredAddress",
              "tradingAddress",
              "shareholdingEntities",
              "shareholders",
              "keyIndividuals",
            ],
          },
        })
      );

      dispatch(
        kycActionCreators.doFetchDropdowns({
          options: [
            "country",
            "legalForm",
            "industryBusinessActvity",
            "sectorBusinessActvity",
            "netAssetsOfEntity",
            "annualTurnover",
            "levelOfOwnFunds",
            "sourceOfFunds",
            "sourceOfVehicleCapital",
            "investedProducts",
            "debtInstrumentsLevel",
            "howLongActive",
            "howOftenInPrivateSecurities",
            "cashOutPeriod",
            "entityTypeClassification",
          ],
        })
      );

      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID({ entityId }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  function createData(label, data) {
    return { label, data };
  }

  const getYesNoValue = (val) => {
    if (val === true) {
      return "Yes";
    }
    if (val === false) {
      return "No";
    }
    return null;
  };

  const countries = getDropdownValues(dropdowns?.country, locale);
  const legalForms = getDropdownValues(dropdowns?.legalForm, locale);
  const netAssetsOfEntity = getDropdownValues(dropdowns?.netAssetsOfEntity, locale);
  const annualTurnover = getDropdownValues(dropdowns?.annualTurnover, locale);
  const levelOfOwnFunds = getDropdownValues(dropdowns?.levelOfOwnFunds, locale);
  const sourceOfFunds = getDropdownValues(dropdowns?.sourceOfFunds, locale);
  const sourceOfVehicleCapital = getDropdownValues(dropdowns?.sourceOfVehicleCapital, locale);
  const investedProducts = getDropdownValues(dropdowns?.investedProducts, locale);
  const debtInstrumentsLevel = getDropdownValues(dropdowns?.debtInstrumentsLevel, locale);
  const howLongActive = getDropdownValues(dropdowns?.howLongActive, locale);
  const howOftenInPrivateSecurities = getDropdownValues(
    dropdowns?.howOftenInPrivateSecurities,
    locale
  );
  const cashOutPeriod = getDropdownValues(dropdowns?.cashOutPeriod, locale);
  const entityTypeClassification = getDropdownValues(dropdowns?.entityTypeClassification, locale);

  const selectedLegalForm = legalForms?.find(
    (legalForm) => legalForm?.value === kycData?.legalFormId
  );
  const selectedRegisteredAddressCountry = countries?.find(
    (country) => country?.value === kycData?.registeredAddress?.countryId
  );
  const selectedTradeAddressCountry = countries?.find(
    (country) => country?.value === kycData?.tradingAddress?.countryId
  );
  const selectedKeyIndividualAddressCountry = countries?.find(
    (country) => country?.value === kycData?.keyIndividuals?.countryId
  );
  const selectedNetAssetsOfEntity = netAssetsOfEntity?.find(
    (row) => row?.value === kycData?.netAssetsOfEntityId
  );
  const selectedAnnualTurnoverOfEntity = annualTurnover?.find(
    (row) => row?.value === kycData?.annualTurnoverId
  );
  const selectedLevelOfOwnFundsOfEntity = levelOfOwnFunds?.find(
    (row) => row?.value === kycData?.levelOwnFundsId
  );
  const selectedSourceOfFundsOfEntity = sourceOfFunds?.find(
    (row) => row?.value === kycData?.sourceOfFundsId
  );
  const selectedSourceOfVehicleCapitalOfEntity = sourceOfVehicleCapital?.find(
    (row) => row?.value === kycData?.vehicleCapitalSourceId
  );
  const selectedInvestedProductsOfEntity = investedProducts?.find(
    (row) => row?.value === kycData?.investedProductsId
  );
  const selectedDebtInstrumentsLvelOfEntity = debtInstrumentsLevel?.find(
    (row) => row?.value === kycData?.debtInstrumentsLevelId
  );
  const selectedHowLongActiveOfEntity = howLongActive?.find(
    (row) => row?.value === kycData?.howLongActiveId
  );
  const selectedHowOftenInPrivateSecuritiesOfEntity = howOftenInPrivateSecurities?.find(
    (row) => row?.value === kycData?.howOftenInPrivateSecuritiesId
  );
  const selectedCashOutPeriodOfEntity = cashOutPeriod?.find(
    (row) => row?.value === kycData?.cashOutPeriodId
  );
  const selectedEntityTypeClassification = entityTypeClassification?.find(
    (row) => row?.value === kycData?.entityType[0]?.questionId
  );

  const selectedRow = {};

  const entityClassificationRows = [
    createData(t("kyc:Classification.Entity Type"), selectedEntityTypeClassification?.label),
  ];

  const entityIdentificationRows = [
    createData(t("kyc:Identification.Form Fields.Registered Name"), kycData?.entityName || ""),
    createData(t("kyc:Identification.Form Fields.Legal Form"), selectedLegalForm?.label),
    createData(t("kyc:Identification.Form Fields.Trading Name(s)"), kycData?.tradingNames || [""]),
    createData(
      t("kyc:Identification.Form Fields.Date of Incorporation"),
      dateFormatter(kycData?.incorporationDate, "DD/MM/YYYY")
    ),
    createData(
      t("kyc:Identification.Form Fields.Place of Incorporation"),
      kycData?.incorporationPlace || ""
    ),
    createData(
      t("kyc:Identification.Form Fields.Legal Entity Identifier (LEI)"),
      kycData?.legalEntityIdentifier || ""
    ),
    createData(
      t("kyc:Identification.Form Fields.Commercial Licence Number"),
      kycData?.commercialRegNo || ""
    ),
    createData(
      t("kyc:Identification.Form Fields.Tax Identitfication Number"),
      kycData?.taxIdentificationNumber || ""
    ),
    createData(
      t("kyc:Identification.Form Fields.Registered Address"),
      `${kycData?.registeredAddress?.addressLine1 || ""}, ${
        kycData?.registeredAddress?.addressLine2 || ""
      }, ${kycData?.registeredAddress?.city || ""}, ${selectedRegisteredAddressCountry?.label}, ${
        kycData?.registeredAddress?.pinCode || ""
      }, ${kycData?.registeredAddress?.businessPhone || ""}`
    ),
    createData(
      t("kyc:Identification.Form Fields.Trading Address"),
      `${kycData?.tradingAddress?.addressLine1 || ""}, ${
        kycData?.tradingAddress?.addressLine2 || ""
      }, ${kycData?.tradingAddress?.city || ""}, ${selectedTradeAddressCountry?.label || ""}, ${
        kycData?.tradingAddress?.pinCode || ""
      }, ${kycData?.tradingAddress?.businessPhone || ""}`
    ),
    createData(
      t("kyc:Identification.Form Fields.Contact Details"),
      `${kycData?.pocBusinessPhone || "N.A"} | ${kycData?.pocEmail || "N.A"}`
    ),
    createData(t("kyc:Identification.Form Fields.Number of Employees"), kycData?.numberOfEmployees),
    createData(
      t("kyc:Identification.Form Fields.Business Activity - Industry"),
      kycData?.businessActivityIndustry?.name
    ),
    createData(
      t("kyc:Identification.Form Fields.Business Activity - Sector"),
      kycData?.businessActivitySector?.name
    ),
    createData(
      t("kyc:Identification.Form Fields.Is the Entity part of a Group"),
      getYesNoValue(kycData?.partOfGroup)
    ),
    createData(
      t(
        "kyc:Identification.Form Fields.Is the Entity supervised by a Financial Services Regulator?"
      ),
      getYesNoValue(kycData?.supervisedByFinancialServicesRegulatory)
    ),
    createData(
      t("kyc:Identification.Form Fields.Name of External Auditor"),
      kycData?.externalAuditor
    ),
  ];

  const entityBankingRows = paymentAccounts.map((account) => {
    const accountName = account?.label;
    return {
      name: accountName,
      data: [
        createData(t("kyc:Banking.Name on Account"), account?.name),
        createData(t("kyc:Banking.Currency"), account?.currency.name),
        createData(t("kyc:Banking.Label"), account?.label),
        createData(t("kyc:Banking.Bank Name"), account?.bankName),
        createData(t("kyc:Banking.IBAN"), account?.iban),
        createData(t("kyc:Banking.SWIFT/BIC"), account?.swift),
        createData(t("kyc:Banking.Address"), account?.address),
      ],
    };
  });

  const entityShareholdersRows = [
    createData(
      t(
        "kyc:Shareholders.Form Fields.Is the Entity ( or its holding company or subsidiary ) publicly listed?"
      ),
      // eslint-disable-next-line no-nested-ternary
      kycData?.publiclyListed !== null ? (kycData?.publiclyListed ? "Yes" : "No") : null
    ),
    createData(
      t(
        "kyc:Shareholders.Form Fields.If yes, provide details of the exchange the Entity is listed on"
      ),
      kycData?.publiclyListedExchange || ""
    ),
    createData(
      t(
        "kyc:Shareholders.Form Fields.If yes, are there any shareholders/controller with 10% or more interest?"
      ),
      // eslint-disable-next-line no-nested-ternary
      kycData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest !== null
        ? kycData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest
          ? "Yes"
          : "No"
        : null
    ),
  ];

  const shareholdingIndividuals = kycData?.shareholders?.map((individual, index) => {
    const individualName = `Shareholding Individual ${index + 1}`;
    return {
      name: individualName,
      data: [
        createData(
          t("kyc:Shareholders.Form Fields.Shareholding Percentage"),
          `${individual?.shareHoldingPercentage}%`
        ),
        createData(t("kyc:Shareholders.Form Fields.First Name"), individual?.firstName || ""),
        createData(t("kyc:Shareholders.Form Fields.Middle Name"), individual?.middleName || ""),
        createData(t("kyc:Shareholders.Form Fields.Last Name"), individual?.lastName || ""),
        createData(
          t("kyc:Shareholders.Form Fields.Politically Exposed Person"),
          selectedRow?.politicallyExposed ? "Yes" : "No"
        ),
        createData(t("kyc:Shareholders.Form Fields.Is the Individual an Entity"), "No"),
      ],
    };
  });

  const shareholdingEntities = kycData?.shareholdingEntities?.map((entity, index) => {
    const entityName = `Shareholding Entity ${index + 1}`;
    return {
      name: entityName,
      data: [
        createData(
          t("kyc:Shareholders.Form Fields.Shareholding Percentage"),
          `${entity?.shareHoldingPercentage}%`
        ),
        createData(t("kyc:Shareholders.Form Fields.Registered Name"), entity?.name || ""),
        createData(
          t("kyc:Shareholders.Form Fields.Legal Entity Identifier (LEI)"),
          entity?.legalEntityIdentifier || ""
        ),
        createData(
          t("kyc:Shareholders.Form Fields.Commercial License Number"),
          entity?.commercialRegNo || ""
        ),
        createData(t("kyc:Shareholders.Form Fields.Is the Individual an Entity"), "Yes"),
      ],
    };
  });

  const keyIndividuals = kycData?.keyIndividuals?.map((individual, index) => {
    const individualName = `Key Individual ${index + 1}`;
    return {
      name: individualName,
      data: [
        createData(t("kyc:Individuals.Form Fields.Capacity"), individual?.capacity?.name),
        createData(t("kyc:Individuals.Form Fields.First Name"), individual?.firstName),
        createData(t("kyc:Individuals.Form Fields.Middle Name"), individual?.middleName),
        createData(t("kyc:Individuals.Form Fields.Last Name"), individual?.lastName),
        createData(
          t("kyc:Individuals.Form Fields.Politically Exposed Person"),
          getYesNoValue(individual?.politicallyExposed)
        ),
        createData(
          t("kyc:Individuals.Form Fields.Address"),
          `${individual?.addressLine1 || ""}, ${individual.addressLine2 || ""}, ${
            individual?.city || ""
          }, ${selectedKeyIndividualAddressCountry?.label || ""}, ${individual?.pinCode || ""}, ${
            individual?.businessPhone || ""
          }`
        ),
      ],
    };
  });

  const entityWealthRows = [
    createData(
      t("kyc:Wealth.Estimated global net assets of the Entity"),
      selectedNetAssetsOfEntity?.label
    ),
    createData(t("kyc:Wealth.Annual turnover"), selectedAnnualTurnoverOfEntity?.label),
    createData(
      `${t("kyc:Wealth.Level of own Funds")} ${t("kyc:Wealth.share capital, investments, cash")}`,
      selectedLevelOfOwnFundsOfEntity?.label
    ),
    createData(t("kyc:Wealth.How has this been built up"), selectedSourceOfFundsOfEntity?.label),
    createData(
      t("kyc:Wealth.What is the source of the Vehicle's capital"),
      selectedSourceOfVehicleCapitalOfEntity?.label
    ),
    createData(
      t("kyc:Wealth.Any other financial information on the Entity's financial situation"),
      kycData?.otherEntityFinancialSituationInfo
    ),
  ];

  const entityExperienceRows = [
    createData(
      t("kyc:Experience.In which products has the Entity previously invested"),
      selectedInvestedProductsOfEntity?.label
    ),
    createData(
      t("kyc:Experience.Has the Entity ever bought, owned or sold privately placed securities"),
      getYesNoValue(kycData?.everBoughtPrivatelyPlacedSecurities)
    ),
    createData(
      t("kyc:Experience.How well does the Entity understand Debentures (products and markets)"),
      selectedDebtInstrumentsLvelOfEntity?.label
    ),
    createData(
      t(
        "kyc:Experience.For how long has the Entity been active on the financial markets/investing in financial products"
      ),
      selectedHowLongActiveOfEntity?.label
    ),
    createData(
      t(
        "kyc:Experience.Does the Entity consult a financial Advisor or use and Investment Manager when making investments decisions"
      ),
      getYesNoValue(kycData?.consultFinancialAdvisor)
    ),
    createData(
      t("kyc:Experience.How often does the Entity invest in privately placed securities in a year"),
      selectedHowOftenInPrivateSecuritiesOfEntity?.label
    ),
    createData(
      t(
        "kyc:Experience.The period during which the Entity expects to cash out their invested money"
      ),
      selectedCashOutPeriodOfEntity?.label
    ),
  ];

  const kycRedirect = (key) => {
    let route = routes.dashboard.administration.entityDetails.kyc.entities.entity.classification;
    switch (key) {
      case "classification":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.classification;
        break;
      case "identification":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.identification;
        break;
      case "banking":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.banking;
        break;
      case "shareholders":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.shareholders;
        break;
      case "key-individuals":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.keyIndividuals;
        break;
      case "wealth":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.wealth;
        break;
      case "experience":
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.experience;
        break;

      default:
        route = routes.dashboard.administration.entityDetails.kyc.entities.entity.classification;
        break;
    }
    // navigate(reverse(`${route}`, { entityId: rowData.id }));
    const win = window.open(reverse(`${route}`, { entityId: rowData.id }), "_blank");
    win.focus();
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{ className: "overflow-y-visible" }}
      >
        <DialogTitle id="set-parent-entity-form-dialog-title" className="font-bold">
          Review KYC
        </DialogTitle>
        <DialogContent>
          {isFetchingKYCData ? (
            <Grid container justifyContent="center">
              <CircularProgress size={40} />
            </Grid>
          ) : (
            <Grid container>
              <TableContainer>
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">
                      {t("kyc:Classification.Entity Classification")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("classification")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Item
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityClassificationRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row" className="w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="w-1/2">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">
                      {t("kyc:Identification.Identification Details of the Entity")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("identification")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Item
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityIdentificationRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row" className="w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="w-1/2">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">{t("kyc:Banking.Banking Details")}</Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("banking")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                {entityBankingRows.map((account) => (
                  <Fragment>
                    <Typography className="mt-8 font-bold text-gray-600">{account.name}</Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Item
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {account?.data?.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row" className="w-1/2">
                              {row.label}
                            </TableCell>
                            <TableCell className="w-1/2">{row.data}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Fragment>
                ))}
                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">
                      {t("kyc:Shareholders.Shareholders / Ultimate Beneficial Owners")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("shareholders")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Item
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityShareholdersRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row" className="w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="w-1/2">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {shareholdingIndividuals?.map((individual) => (
                  <Fragment>
                    <Typography className="mt-8 font-bold text-gray-600">
                      {individual.name}
                    </Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Item
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {individual?.data?.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row" className="w-1/2">
                              {row.label}
                            </TableCell>
                            <TableCell className="w-1/2">{row.data}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Fragment>
                ))}
                {shareholdingEntities?.map((entity) => (
                  <Fragment>
                    <Typography className="mt-8 font-bold text-gray-600">{entity.name}</Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Item
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entity?.data?.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row" className="w-1/2">
                              {row.label}
                            </TableCell>
                            <TableCell className="w-1/2">{row.data}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Fragment>
                ))}

                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">{t("kyc:Individuals.Key Individuals")}</Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("key-individuals")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                {keyIndividuals?.map((individual) => (
                  <Fragment>
                    <Typography className="mt-8 font-bold text-gray-600">
                      {individual.name}
                    </Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Item
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={1} className="w-1/2">
                            <Typography color="primary" className="font-bold">
                              Data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {individual?.data?.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row" className="w-1/2">
                              {row.label}
                            </TableCell>
                            <TableCell className="w-1/2">{row.data}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Fragment>
                ))}
                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">{t("kyc:Wealth.Entitys Wealth")}</Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("wealth")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Item
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityWealthRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row" className="w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="w-1/2">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <br />
                <br />
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Grid item xs={6} container alignContent="center">
                    <Typography variant="h6">
                      {t(
                        "kyc:Experience.Experience and Understanding of Financial Markets and Products"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => kycRedirect("experience")}
                      endIcon={<Icon>chevron_right</Icon>}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Item
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1} className="w-1/2">
                        <Typography color="primary" className="font-bold">
                          Data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityExperienceRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row" className="w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="w-1/2">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="flex-end" className="mx-4 mb-4">
            <Grid item xs={12} lg={3} className="px-4">
              <Button variant="outlined" color="primary" fullWidth onClick={onClose}>
                {t("kyc:Buttons.Close")}
              </Button>
            </Grid>
            <Grid item xs={12} lg={3} className="px-4">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => kycRedirect("classification")}
              >
                {t("kyc:Buttons.View KYC")}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

ViewKYCModal.propTypes = {};

export default ViewKYCModal;
