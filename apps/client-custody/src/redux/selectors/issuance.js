import { capitalCase } from "change-case";
import { produce } from "immer";
import { createSelector } from "reselect";

import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import { selectCurrentEntityGroup } from "./auth";

export const selectIssuancesData = (state) => state.issuance.issuances;

export const selectListOfIssuanceObjects = createSelector([selectIssuancesData], (issuances) => {
  if (issuances?.length > 0) {
    return issuances.map((item) => ({
      id: item.id,
      corporateEntityName: item.corporateEntityName,
      createdAt: item.createdAt,
      currencyName: item.currencyName?.name,
      distributionMethodName: item.distributionMethodName?.name,
      issuanceAmount: item.issuanceAmount,
      issueDate: item.issueDate,
      issuerSPVStatus: item.issuerSPVStatus,
      name: item.name,
      pricingName: item.pricingName?.name,
      sukukTypeName: item.sukukTypeName?.name,
      status: item.status,
      ticker: item.ticker,
      hybridSukukType: item.hybridSukukType,
      tradeDate: item.tradeDate,
      updatedAt: item.updatedAt,
      wsn: item.wsn,
      obligorName: item.obligorName,
      hasLegalCounsel: item?.hasLegalCounsel,
      hasObligorIssuerInvite: item?.hasObligorIssuerInvite,
    }));
  }

  return [];
});

export const selectIsFetching = (state) => state.issuance.isFetching;
export const selectIsRequesting = (state) => state.issuance.isRequesting;
export const selectMessage = (state) => state.issuance.message;
export const selectIssuerClients = (state) => state.issuance.issuerClients;
export const selectCoArrangers = (state) => state.issuance.coArrangers;
export const selectIssuers = (state) => state.issuance.issuers;
export const selectIsFetchingIssuances = (state) => state.issuance.isFetchingIssuances;
export const selectDropDowns = (state) => state.issuance.dropdowns;
export const selectIssuanceOverview = (state) => state.issuance?.issuanceOverview;
export const selectTermsheet = (state) => state.issuance?.termsheet;
export const selectFinalterms = (state) => ({
  document: state.issuance.finalterms?.document ?? null,
  link: state.issuance.finalterms?.link ?? "",
  legalCounselApproval: state.issuance?.finalterms?.legalCounselApproval ?? false,
});

export const selectIsFetchingFinalterms = (state) => state.issuance.isFetchingFinalterms;

export const selectInvestors = (state) => state.issuance?.investors ?? [];
export const selectEnabledInvestors = createSelector([selectInvestors], (investors) => {
  if (investors.length > 0) {
    return investors.filter((investor) => investor.isEnabled);
  }

  return [];
});

export const selectSubscriptionData = (state) =>
  state.issuance?.subscriptionData ?? {
    subscriptions: [],
  };

export const selectIssuanceSize = createSelector([selectSubscriptionData], (subscriptionData) =>
  parseFloat(subscriptionData?.issuanceAmount ?? 0)
);

export const selectProfitRate = createSelector([selectSubscriptionData], (subscriptionData) =>
  parseFloat(subscriptionData?.profitRate ?? 0)
);

export const selectDenominationValue = createSelector(
  [selectSubscriptionData],
  (subscriptionData) => parseFloat(subscriptionData?.denominationName?.value ?? 0)
);

export const selectCurrencyName = createSelector(
  [selectSubscriptionData],
  (subscriptionData) => subscriptionData?.currencyName?.name ?? "USD"
);

export const selectSubscriptions = createSelector(
  [selectSubscriptionData, selectEnabledInvestors, selectDenominationValue],
  (subscriptionData, enabledInvestors, denominationValue) => {
    const result = [];

    if (subscriptionData?.subscriptions.length > 0 && denominationValue > 0) {
      const { subscriptions } = subscriptionData;

      subscriptions.forEach((subscription) => {
        const { entityGroupId, subscriptionAmount, status } = subscription;
        const investor = enabledInvestors.find((i) => i.entityGroupId === entityGroupId);

        result.push({
          entityGroupId,
          investor: investor?.corporateEntityName ?? "-",
          subAmount: convertNumberToIntlFormat(subscriptionAmount),
          certificates: parseFloat(subscriptionAmount ?? 0) / denominationValue,
          eoiStatus: capitalCase(status),
        });
      });
    }
    return result;
  }
);

export const selectSigningPreActionData = (state) => ({
  hasCreatedSPV: state.issuance?.signingPreActionData?.hasCreatedSPV ?? false,
  hasDueDiligence: state.issuance?.signingPreActionData?.hasDueDiligence ?? false,
  hasConditionsPrecedent: state.issuance?.signingPreActionData?.hasConditionsPrecedent ?? false,
  spvName: state.issuance?.signingPreActionData?.spvName ?? "",
  spvEmail: state.issuance?.signingPreActionData?.spvEmail ?? "",
});

export const selectDocusignUrl = (state) => state.issuance.docusignURL;
export const selectClosingData = (state) => state.issuance.closingData;

export const selectAllClosingSignoffData = createSelector([selectClosingData], (closingData) => {
  if (!closingData) return [];

  const arrangerSignoffData = {
    entityGroupID: closingData?.arranger?.id,
    party: closingData?.arranger?.corporateEntityName,
    role: "Arranger",
    signOffStatus: closingData?.arranger?.signOffStatus,
  };

  const coArrangerSignoffData = {
    entityGroupID: closingData?.coArranger?.id,
    party: closingData?.coArranger?.corporateEntityName,
    role: "Co-Arranger",
    signOffStatus: closingData?.coArranger?.signOffStatus,
  };

  const obligorSignoffData = {
    entityGroupID: closingData?.obligor?.id,
    party: closingData?.obligor?.corporateEntityName,
    role: "Obligor",
    signOffStatus: closingData?.obligor?.signOffStatus,
  };

  // fiduciary signoff isn't required
  const fiduciarySignoffData = {
    entityGroupID: closingData?.fiduciary?.providerEntityGroupId,
    party: closingData?.fiduciary?.providerEntityGroup?.entity?.corporateEntityName, // AWAITING API UPDATE
    role: "Fiduciary",
    signOffStatus: closingData?.fiduciary?.signOffStatus,
  };

  const issuerSignoffData = {
    entityGroupID: closingData?.issuer?.id,
    party: closingData?.issuer?.corporateEntityName,
    role: "Issuer",
    signOffStatus: closingData?.issuer?.signOffStatus,
  };

  // investors signoff isn't required
  const investorsSignoffData =
    closingData?.investors?.map((investor) => ({
      entityGroupID: investor?.entityGroup?.id,
      party: investor?.entityGroup?.entity?.corporateEntityName ?? "N/A",
      role: "Investor",
      signOffStatus: investor.signOffStatus,
    })) ?? [];

  // const filteredClosingData = [arrangerSignoffData, coArrangerSignoffData, obligorSignoffData, fiduciarySignoffData, issuerSignoffData, ...investorsSignoffData].filter((i) => i.entityGroupID);
  const filteredClosingData = [
    arrangerSignoffData,
    coArrangerSignoffData,
    obligorSignoffData,
    issuerSignoffData,
  ].filter((i) => i.entityGroupID);

  return filteredClosingData;
});

export const selectOwnClosingSignoffData = createSelector(
  [selectAllClosingSignoffData, selectCurrentEntityGroup],
  (allClosingSignoffs, currentEntityGroup) => {
    if (!allClosingSignoffs) return [];

    return allClosingSignoffs.filter((i) => i.entityGroupID === currentEntityGroup.id);
  }
);

export const selectTermsheetData = createSelector([selectTermsheet], (termsheet) => {
  const intialTermsheetValues = {
    securityShortName: null,
    securityLongName: null,
    name: null,
    ticker: null,
    hybridSukukType: null,
    pricingName: null,
    seriesNumber: null,
    tradeDate: null,
    maturityDate: null,
    status: null,
    issuanceAmount: null,
    issueDate: null,
    version: null,
    issuePrice: null,
    typeOfIssuance: null,
    underlyingAssets: null,
    profitRate: null,
    issuerSPVEmail: null,
    maturityAmount: null,
    denominationName: null,
    currencyName: null,
    sukukTypeName: null,
    profitRateTermsName: null,
    frequencyName: null,
    dayCountConventionName: null,
    sellingRestrictionsName: null,
    distributionMethodName: null,
    formOfOfferingName: null,
    useOfProceedsName: null,
    shariahComplianceName: null,
    rankingName: null,
    listingName: null,
    ratingName: null,
    governingLawName: null,
    jurisdictionName: null,
    obligor: null,
    arranger: null,
    isin: null,
    exchangeCode: null,
    arrangerPublished: null,
    legalCounselPublished: null,
    arrangerReviewRequired: null,
  };
  if (termsheet) {
    return {
      ...produce(termsheet, (draft) => {
        draft.profitRate = parseFloat(termsheet?.profitRate ?? 0).toFixed(2);
        draft.maturityAmount = parseFloat(termsheet?.maturityAmount ?? 0).toFixed(2);
        draft.issuePrice = parseFloat(termsheet?.issuePrice ?? 0).toFixed(2);
        draft.currency = termsheet.currencyName
          ? { label: termsheet.currencyName.name, value: termsheet.currencyName.id }
          : intialTermsheetValues.currencyName;
        draft.denomination = termsheet.denominationName
          ? { label: termsheet.denominationName.value, value: termsheet.denominationName.id }
          : intialTermsheetValues.denominationName;
        draft.profitRateTerms = termsheet.profitRateTermsName
          ? { label: termsheet.profitRateTermsName.name, value: termsheet.profitRateTermsName.id }
          : intialTermsheetValues.profitRateTermsName;
        draft.frequency = termsheet.frequencyName
          ? { label: termsheet.frequencyName.name, value: termsheet.frequencyName.id }
          : intialTermsheetValues.frequencyName;
        draft.dayCountConvention = termsheet.dayCountConventionName
          ? {
              label: termsheet.dayCountConventionName.name,
              value: termsheet.dayCountConventionName.id,
            }
          : intialTermsheetValues.dayCountConventionName;
        draft.sellingRestrictions = termsheet.sellingRestrictionsName
          ? {
              label: termsheet.sellingRestrictionsName.name,
              value: termsheet.sellingRestrictionsName.id,
            }
          : intialTermsheetValues.sellingRestrictionsName;
        draft.formOfOffering = termsheet.formOfOfferingName
          ? { label: termsheet.formOfOfferingName.name, value: termsheet.formOfOfferingName.id }
          : intialTermsheetValues.formOfOfferingName;
        draft.useOfProceeds = termsheet.useOfProceedsName
          ? { label: termsheet.useOfProceedsName.name, value: termsheet.useOfProceedsName.id }
          : intialTermsheetValues.useOfProceedsName;
        draft.shariahCompliance = termsheet.shariahComplianceName
          ? {
              label: termsheet.shariahComplianceName.name,
              value: termsheet.shariahComplianceName.id,
            }
          : intialTermsheetValues.shariahComplianceName;
        draft.ranking = termsheet.rankingName
          ? { label: termsheet.rankingName.name, value: termsheet.rankingName.id }
          : intialTermsheetValues.rankingName;
        draft.listing = termsheet.listingName
          ? { label: termsheet.listingName.name, value: termsheet.listingName.id }
          : intialTermsheetValues.listingName;
        draft.rating = termsheet.ratingName
          ? { label: termsheet.ratingName.name, value: termsheet.ratingName.id }
          : intialTermsheetValues.ratingName;
        draft.governingLaw = termsheet.governingLawName
          ? { label: termsheet.governingLawName.name, value: termsheet.governingLawName.id }
          : intialTermsheetValues.governingLawName;
        draft.jurisdiction = termsheet.jurisdictionName
          ? { label: termsheet.jurisdictionName.name, value: termsheet.jurisdictionName.id }
          : intialTermsheetValues.jurisdictionName;
      }),
    };
  }

  return intialTermsheetValues;
});

export const selectServiceProviders = (state) => state.issuance.serviceProviders;
export const selectFetchingServiceProviders = (state) => state.issuance.isFetchingServiceProviders;
export const selectEngagementRequests = (state) => state.issuance.engagementRequests;
export const selectFetchingTermsheet = (state) => state.issuance.isFetchingTermsheet;
export const selectEngagementLetterUrl = (state) => state.issuance.letterUrl;
export const selectAdmissionTermsData = (state) => ({
  sukukData: state.issuance.admissionTermsheetData?.sukukData,
  subscriptions: state.issuance.admissionTermsheetData?.subscriptions,
  investors: state.issuance.termsheet?.investors,
  issuerDetails: state.issuance.admissionTermsheetData?.issuerDetails,
});

export const selectAdmissionTerms = (state) => state.issuance.admissionTerms;

export const selectFetchingOverview = (state) => state.issuance.isFetchingIssuanceOverview;
export const selectFetchingInvestors = (state) => state.issuance.isFetchingInvestors;
export const selectFetchingEngagementRequests = (state) =>
  state.issuance.isFetchingEnagementRequests;
export const selectAreEngagementDocumentsUploading = (state) =>
  state.issuance.areEngagementDocumentsUploading;
export const selectFetchingAdmissionTerms = (state) => state.issuance.isFetchingAdmissionTerms;
export const selectFetchingSubscriptions = (state) => state.issuance.isFetchingSubscriptions;
export const selectFetchingClosingData = (state) => state.issuance.isFetchingClosingData;
export const selectFetchingAdmissionTermsheetData = (state) =>
  state.issuance.isFetchingAdmissionTermsheetData;

export const selectProjectTeam = (state) => (entityType) => {
  const entity = state.issuance.issuanceOverview ? state.issuance.issuanceOverview.projectTeam : [];
  return entity.find((member) => member.entityType === entityType);
};

export const selectEngagementObligorProposalSignedDocURL = (state) =>
  state.issuance?.engagementObligorProposalSignedDocURL?.link;
export const selectFetchingEngagementObligorProposalSignedDocURL = (state) =>
  state.issuance?.isFetchingEngagementObligorProposalSignedDocURL;
export const selectIsSubmittingAdmissionTerms = (state) =>
  state.issuance.isSubmittingAdmissionTerms;

export const selectIsFetchingStatus = (state) => state.issuance.isFetchingStatus;
export const selectSukukStatus = (state) => state.issuance.sukukStatus;

export const selectTermsheetInfo = createSelector([selectTermsheet], (termsheet) => ({
  securityShortName: termsheet?.securityShortName,
  securityLongName: termsheet?.securityShortName,
  name: termsheet?.name,
  ticker: termsheet?.ticker,
  hybridSukukType: termsheet?.hybridSukukType,
  arranger: termsheet?.arranger,
  arrangerDetails: termsheet?.arrangerDetails ?? null,
  certificateCount: convertNumberToIntlFormat(
    parseInt(termsheet?.issuanceAmount, 10) / parseInt(termsheet?.denominationName?.value, 10)
  ),
  currencyName: termsheet?.currencyName?.name,
  dayCountConventionName: termsheet?.dayCountConventionName?.name,
  denominationName: convertNumberToIntlFormat(termsheet?.denominationName?.value),
  distributionMethodName: termsheet?.distributionMethodName?.name,
  formOfOfferingName: termsheet?.formOfOfferingName?.name,
  frequencyName: termsheet?.frequencyName?.name,
  governingLawName: termsheet?.governingLawName?.name,
  guarantor: termsheet?.guarantor,
  issuanceAmount: convertNumberToIntlFormat(termsheet?.issuanceAmount),
  issuanceAmount_original: termsheet?.issuanceAmount,
  issueDate: dateFormatter(termsheet?.issueDate, "DD/MM/YYYY HH:MM"),
  issuePrice: convertNumberToIntlFormat(termsheet?.issuePrice),
  jurisdictionName: termsheet?.jurisdictionName?.name,
  legalCounselApproval: termsheet?.legalCounselApproval ?? false,
  listingName: termsheet?.listingName?.name,
  maturityAmount: convertNumberToIntlFormat(termsheet?.maturityAmount),
  maturityDate: dateFormatter(termsheet?.maturityDate, "DD/MM/YYYY HH:MM"),
  obligor: termsheet?.obligor,
  profitRate: convertNumberToIntlFormat(termsheet?.profitRate),
  profitRateTermsName: termsheet?.profitRateTermsName?.name,
  rankingName: termsheet?.rankingName?.name,
  ratingName: termsheet?.ratingName?.name,
  sellingRestrictionsName: termsheet?.sellingRestrictionsName?.name,
  pricingName: termsheet?.pricingName?.name,
  shariahComplianceName: termsheet?.shariahComplianceName?.name,
  status: termsheet?.status,
  sukukTypeName: termsheet?.sukukTypeName?.name,
  tradeDate: dateFormatter(termsheet?.tradeDate, "DD/MM/YYYY HH:MM"),
  underlyingAssets: termsheet?.underlyingAssets,
  useOfProceedsName: termsheet?.useOfProceedsName?.name,
  isin: termsheet?.isin ?? null,
  exchangeCode: termsheet?.exchangeCode ?? null,
  arrangerPublished: termsheet?.arrangerPublished ?? null,
  legalCounselPublished: termsheet?.legalCounselPublished ?? null,
  arrangerReviewRequired: termsheet?.arrangerReviewRequired ?? null,
}));

export const selectTermsheetInfoAr = createSelector([selectTermsheet], (termsheet) => ({
  securityShortName: termsheet?.securityShortName,
  securityLongName: termsheet?.securityShortName,
  name: termsheet?.name,
  ticker: termsheet?.ticker,
  hybridSukukType: termsheet?.hybridSukukType,
  arranger: termsheet?.arranger,
  arrangerDetails: termsheet?.arrangerDetails ?? null,
  certificateCount:
    parseInt(termsheet?.issuanceAmount, 10) / parseInt(termsheet?.denominationName?.value, 10),
  currencyName: termsheet?.currencyName?.nameAr,
  dayCountConventionName: termsheet?.dayCountConventionName?.nameAr,
  denominationName: convertNumberToIntlFormat(termsheet?.denominationName?.value),
  distributionMethodName: termsheet?.distributionMethodName?.nameAr,
  formOfOfferingName: termsheet?.formOfOfferingName?.nameAr,
  frequencyName: termsheet?.frequencyName?.nameAr,
  governingLawName: termsheet?.governingLawName?.nameAr,
  guarantor: termsheet?.guarantor,
  issuanceAmount: convertNumberToIntlFormat(termsheet?.issuanceAmount),
  issueDate: dateFormatter(termsheet?.issueDate, "DD/MM/YYYY HH:MM"),
  issuePrice: convertNumberToIntlFormat(termsheet?.issuePrice),
  jurisdictionName: termsheet?.jurisdictionName?.nameAr,
  legalCounselApproval: termsheet?.legalCounselApproval ?? false,
  listingName: termsheet?.listingName?.nameAr,
  maturityAmount: convertNumberToIntlFormat(termsheet?.maturityAmount),
  maturityDate: dateFormatter(termsheet?.maturityDate, "DD/MM/YYYY HH:MM"),
  obligor: termsheet?.obligor,
  profitRate: convertNumberToIntlFormat(termsheet?.profitRate),
  profitRateTermsName: termsheet?.profitRateTermsName?.nameAr,
  rankingName: termsheet?.rankingName?.nameAr,
  ratingName: termsheet?.ratingName?.nameAr,
  sellingRestrictionsName: termsheet?.sellingRestrictionsName?.nameAr,
  pricingName: termsheet?.pricingName?.nameAr,
  shariahComplianceName: termsheet?.shariahComplianceName?.nameAr,
  status: termsheet?.status,
  sukukTypeName: termsheet?.sukukTypeName?.nameAr,
  tradeDate: dateFormatter(termsheet?.tradeDate, "DD/MM/YYYY HH:MM"),
  underlyingAssets: termsheet?.underlyingAssets,
  useOfProceedsName: termsheet?.useOfProceedsName?.nameAr,
  isin: termsheet?.isin ?? null,
  exchangeCode: termsheet?.exchangeCode ?? null,
  arrangerPublished: termsheet?.arrangerPublished ?? null,
  legalCounselPublished: termsheet?.legalCounselPublished ?? null,
  arrangerReviewRequired: termsheet?.arrangerReviewRequired ?? null,
}));

export const selectPrivatePlacementIssuanceStatusObject = createSelector(
  [selectIssuanceOverview],
  (issuanceOverview) => {
    const STATES_ENUM = {
      NOT_STARTED: "not_started",
      IN_PROGRESS: "in_progress",
      COMPLETED: "completed",
    };

    const stages = {
      TermSheetGeneration: STATES_ENUM.NOT_STARTED,
      Subscription: STATES_ENUM.NOT_STARTED,
      SubscriptionConfirmations: STATES_ENUM.NOT_STARTED,
      Signing: STATES_ENUM.NOT_STARTED,
      Closing: STATES_ENUM.NOT_STARTED,
      AdmissionSettlement: STATES_ENUM.NOT_STARTED,
      CertificateAllocation: STATES_ENUM.NOT_STARTED,
      BidPayments: STATES_ENUM.NOT_STARTED,
      CertificateRegistry: STATES_ENUM.NOT_STARTED,
      CouponPayment: STATES_ENUM.NOT_STARTED,
      RedemptionPayment: STATES_ENUM.NOT_STARTED,
    };

    if (
      !issuanceOverview?.status ||
      issuanceOverview?.distributionMethodName?.name !== "Private Placement"
    )
      return stages;

    let markAsCompleted = true;

    Object.keys(stages).forEach((stageName) => {
      if (stageName === issuanceOverview?.status) {
        stages[stageName] = STATES_ENUM.IN_PROGRESS;
        markAsCompleted = false;
      }

      if (markAsCompleted) {
        stages[stageName] = STATES_ENUM.COMPLETED;
      }
    });

    return stages;
  }
);

export const selectCapitalMarketAuthorityData = (state) =>
  state.issuance.capitalMarketAuthorityData;

export const selectCapitalMarketAuthorityDocumentURLs = (state) =>
  state.issuance.capitalMarketAuthorityDocumentURLs;

export const selectAllIssuancesData = (state) => state.issuance.allIssuances;

export const selectIsFetchingLetterUrl = (state) => state.issuance.isFetchingLetterUrl;

export const selectIssuancesByStatus = (state) => state.issuance?.allIssuances ?? [];

export const selectHasSavedTermsheet = (state) => state.issuance.hasSavedTermsheet;

export const selectHasSubmittedBypassSignedEngagement = (state) =>
  state.issuance.hasSubmittedBypassSignedEnagagement;

export const selectIsSubmittingBypassSignedEngagement = (state) =>
  state.issuance.isSubmittingBypassSignedEngagement;

export const selectHasEngagementLetterUploaded = (state) =>
  state.issuance.hasEngagementLetterUploaded;

export const selectIssuanceOverviewProviders = (state) =>
  state.issuance?.issuanceOverview?.providers;
