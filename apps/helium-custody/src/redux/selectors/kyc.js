import { produce } from "immer";
import { createSelector } from "reselect";

import kycOnboardingStatusEnum from "../../constants/wethaqAPI/kycOnboardingStatusEnum";
import { selectCurrentEntityGroup } from "./auth";

export const selectEOIData = (state) => state.kyc.eoiData;

export const selectEOIStatus = createSelector(
  [selectEOIData],
  (eoiData) => eoiData?.status ?? null
);

export const selectEntityName = createSelector(
  [selectEOIData],
  (eoiData) => eoiData?.entityName ?? ""
);

export const selectKYCData = (state) => state.kyc.kycData;

export const selectKYCRequirementData = createSelector([selectKYCData], (kycData) => {
  const defaultValues = {
    companyRegisterExtractFileName: undefined,
    certificateOfIncorporationFileName: undefined,
    articlesOfAssociationFileName: undefined,
    ownershipStructureChartFileName: undefined,
    legalEntityIdentifier: null,
    ultimateBeneficiaryOwners: null,
    directors: null,
    authorisedSignatories: null,
    taxIdentificationNumber: null,
    taxResidenceFileName: null,
    POAFileName: null,
    primaryOperations: null,
    mainSubsidiariesBusiness: null,
    hasBearerShares: null,
    operatingAddress: null,
    domicileAddress: null,
    mailingAddress: null,
    bearerShareDetails: null,
    deemedProfessionalDocs: undefined,
    balanceSheet: undefined,
    authorisedPersonAddressLine1: undefined,
    authorisedPersonAddressLine2: undefined,
    authorisedPersonCity: undefined,
    authorisedPersonPincode: undefined,
    authorisedPersonCountry: undefined,
    authorisedPersonUtilityFileName: undefined,
    commercialRegNo: undefined,
    businessStartDate: undefined,
    name: undefined,
    mainBusiness: undefined,
    countryPractisingBusiness: undefined,
    numOfEmployees: undefined,
    paidUpCapital: undefined,
    annualTurnover: undefined,
    contactPersonEmail: undefined,
    otherFinancialInformationFileName: undefined,
    contactPersonName: undefined,
    authorisedPersonBuildingNumber: undefined,
    authorisedPersonStreetName: undefined,
    authorisedPersonPostalCode: undefined,
    authorisedPersonDistrict: undefined,
    authorisedPersonAdditionalNumber: undefined,
    authorisedPersonBusinessPhone: undefined,
    authorisedPersonMobileNumber: undefined,
    status: undefined,
  };
  if (kycData) {
    const updatedKYCFieldObjects = Object.assign(
      ...Object.keys(kycData)
        .filter((key) => Object.keys(defaultValues).includes(key))
        .map((key) => ({
          [key]: kycData[key],
        }))
    );

    if (updatedKYCFieldObjects.hasBearerShares) {
      updatedKYCFieldObjects.hasBearerShares = "true";
    } else if (updatedKYCFieldObjects.hasBearerShares === false) {
      updatedKYCFieldObjects.hasBearerShares = "false";
    }

    if (updatedKYCFieldObjects.authorisedPersonCountry) {
      updatedKYCFieldObjects.authorisedPersonCountry = {
        label: updatedKYCFieldObjects.authorisedPersonCountry.name,
        value: updatedKYCFieldObjects.authorisedPersonCountry.id,
      };
    }

    if (
      updatedKYCFieldObjects.operatingAddress &&
      Object.keys(updatedKYCFieldObjects.operatingAddress).length
    ) {
      const address = { ...updatedKYCFieldObjects.operatingAddress };
      address.selected = true;
      if (updatedKYCFieldObjects.operatingAddress.countryId) {
        address.country = {
          label: updatedKYCFieldObjects.operatingAddress.country.name,
          value: updatedKYCFieldObjects.operatingAddress.country.id,
        };
      }
      updatedKYCFieldObjects.operatingAddress = address;
    }
    if (
      updatedKYCFieldObjects.domicileAddress &&
      Object.keys(updatedKYCFieldObjects.domicileAddress).length
    ) {
      const address = { ...updatedKYCFieldObjects.domicileAddress };
      address.selected = true;
      if (updatedKYCFieldObjects.domicileAddress.countryId) {
        address.country = {
          label: updatedKYCFieldObjects.domicileAddress.country.name,
          value: updatedKYCFieldObjects.domicileAddress.country.id,
        };
      }
      updatedKYCFieldObjects.domicileAddress = address;
    }
    if (
      updatedKYCFieldObjects.mailingAddress &&
      Object.keys(updatedKYCFieldObjects.mailingAddress).length
    ) {
      const address = { ...updatedKYCFieldObjects.mailingAddress };
      address.selected = true;
      if (updatedKYCFieldObjects.mailingAddress.countryId) {
        address.country = {
          label: updatedKYCFieldObjects.mailingAddress.country.name,
          value: updatedKYCFieldObjects.mailingAddress.country.id,
        };
      }
      updatedKYCFieldObjects.mailingAddress = address;
    }
    if (
      updatedKYCFieldObjects.ultimateBeneficiaryOwners &&
      updatedKYCFieldObjects.ultimateBeneficiaryOwners.length
    ) {
      const ubos = [];
      updatedKYCFieldObjects.ultimateBeneficiaryOwners.forEach((val) => {
        const modified = { ...val };
        modified.isPoilticallyExposed = modified.isPoilticallyExposed === true ? "true" : undefined;
        if (val.countryOfResidence) {
          modified.countryOfResidence = {
            label: val.countryOfResidenceName.name,
            value: val.countryOfResidenceName.id,
          };
        }
        ubos.push(modified);
      });
      updatedKYCFieldObjects.ultimateBeneficiaryOwners = ubos;
    }
    if (updatedKYCFieldObjects.directors && updatedKYCFieldObjects.directors.length) {
      const directors = [];
      updatedKYCFieldObjects.directors.forEach((val) => {
        const modified = { ...val };
        if (val.countryId) {
          modified.countryId = { label: val.country.name, value: val.country.id };
        }
        directors.push(modified);
      });
      updatedKYCFieldObjects.directors = directors;
    }
    return {
      ...updatedKYCFieldObjects,
    };
  }

  return defaultValues;
});

export const selectSanctionsQuestionnaireData = createSelector([selectKYCData], (kycData) => {
  const initialQuestionnaireValues = {
    sanctionsUsedForChild: null,
    prospectOperatingFrom: [],
    branchesOperatingFrom: [],
    controlledResidingIn: [],
    assetsIn: [],
  };

  if (kycData) {
    return {
      ...produce(kycData, (draft) => {
        delete draft.status;
        delete draft.entityName;

        draft.prospectOperatingFrom =
          kycData.prospectOperatingFrom.length > 0
            ? kycData.prospectOperatingFrom
            : initialQuestionnaireValues.prospectOperatingFrom;

        draft.branchesOperatingFrom =
          kycData.branchesOperatingFrom.length > 0
            ? kycData.branchesOperatingFrom
            : initialQuestionnaireValues.branchesOperatingFrom;

        draft.controlledResidingIn =
          kycData.controlledResidingIn.length > 0
            ? kycData.controlledResidingIn
            : initialQuestionnaireValues.controlledResidingIn;

        draft.assetsIn =
          kycData.assetsIn.length > 0 ? kycData.assetsIn : initialQuestionnaireValues.assetsIn;

        draft.sanctionsUsedForChild = kycData.sanctionsUsedForChild;
      }),
    };
  }

  return initialQuestionnaireValues;
});

export const selectKYCFileData = createSelector([selectKYCData], (kycData) => {
  if (kycData) {
    const {
      articlesOfAssociationFileName,
      authorisedPersonIDFileName,
      authorisedPersonUtilityFileName,
      authorisedSignatory,
      boardResolutionFileName,
      certificateOfIncorporationFileName,
      clientClassificationFileName,
      clientClassificationSupportDocs,
      companyRegisterExtractFileName,
      declarationOfAuthenticity,
      directors,
      domicileAddress,
      indicationOfCapacity,
      mailingAddress,
      operatingAddress,
      ownershipStructureChartFileName,
      POAFileName,
      proofOfAuthorization,
      taxResidenceFileName,
    } = kycData;

    return {
      articlesOfAssociationFileName,
      authorisedPersonIDFileName,
      authorisedPersonUtilityFileName,
      authorisedSignatoryPassportCopy: authorisedSignatory?.passportCopyFileName,
      boardResolutionFileName,
      certificateOfIncorporationFileName,
      clientClassificationFileName,
      clientClassificationSupportDocs,
      companyRegisterExtractFileName,
      declarationOfAuthenticity,
      directors,
      domicileAddressUtilityFileName: domicileAddress?.utilityFileName,
      indicationOfCapacity,
      mailingAddressUtilityFileName: mailingAddress?.utilityFileName,
      operatingAddressUtilityFileName: operatingAddress?.utilityFileName,
      ownershipStructureChartFileName,
      POAFileName,
      proofOfAuthorization,
      taxResidenceFileName,
    };
  }

  return null;
});

export const selectErrorMessage = (state) => state.kyc.errorMessage;
export const selectIsFetching = (state) => state.kyc.isFetching;
export const selectIsSubmitting = (state) => state.kyc.isSubmitting;

// TODO: DRY up kycSelectors code

export const selectIsFetchingUpdatedKYCPartialData = (state) =>
  state.kyc.isFetchingUpdatedKYCPartialData;

export const selectClientClassificationDropdownData = (state) =>
  state.kyc.clientClassificationDropdownData || {};

export const selectClientClassificationData = createSelector([selectKYCData], (kycData) => {
  const defaultValues = {
    deemedProfessionalClientSelections: null,
    balanceSheet: null,
    academic: null,
    hasFundsAndExperience: null,
    institutionalClientSelections: null,
    professions: null,
    certifications: null,
    investmentFrequency: null,
    regulatedEntityAdviceFrequency: null,
    hasAdviceForWethaqPlatform: null,
    hasInvestmentPortfolio: null,
    regulatedEntityName: null,
    supervisoryAuthorityName: null,
    portfolioDetails: null,
    userSelfClassification: null,
    deemedProfessionalDocsSelectionType: null,
  };

  if (kycData) {
    const ccData = Object.assign(
      ...Object.keys(kycData)
        .filter((key) => Object.keys(defaultValues).includes(key))
        .map((key) => ({
          [key]: kycData[key],
        }))
    );

    if (kycData.deemedProfessionalClientSelections) {
      ccData.deemedProfessionalClientSelections =
        kycData.deemedProfessionalClientSelections.questionId;
    }
    if (kycData.institutionalClientSelections) {
      ccData.institutionalClientSelections = kycData.institutionalClientSelections.questionId;
    }

    if (kycData.certifications && kycData.certifications.length) {
      ccData.heldPosition = "true";
    }
    if (kycData.hasAdviceForWethaqPlatform) {
      ccData.hasAdviceForWethaqPlatform = "true";
    }
    if (kycData.hasInvestmentPortfolio) {
      ccData.hasInvestmentPortfolio = "true";
    }
    if (kycData.investmentFrequency && kycData.investmentFrequency.length) {
      const modifiedFreqs = [];
      kycData.investmentFrequency.forEach((freq) => {
        const data = { ...freq };
        if (data.year) data.year = new Date(data.year);
        modifiedFreqs.push(data);
      });
      ccData.investmentFrequency = modifiedFreqs;
    }

    return {
      ...ccData,
    };
  }

  return defaultValues;
});

export const selectIsUploading = (state) => state.kyc.uploadInProgress > 0;
export const selectFilesUploaded = (state) => state.kyc.filesUploaded;

export const selectDeclarationData = createSelector([selectKYCData], (kycData) => ({
  declarationOfAuthorisation: kycData?.declarationOfAuthorisation,
  acceptedTnc: kycData?.acceptedTnc,
}));

export const selectIsLoading = (state) => state.kyc.isLoading;
export const selectIsFetchingKycData = (state) => state.kyc.isFetchingKycData;

export const selectStatusData = createSelector([selectKYCData], (kycData) => {
  if (kycData) {
    const { kycOfficerCurrentScreen, authorizedPersonCurrentScreen } = kycData;

    return {
      kycOfficerCurrentScreen: kycOfficerCurrentScreen ? parseInt(kycOfficerCurrentScreen, 10) : 0,
      authorizedPersonCurrentScreen: authorizedPersonCurrentScreen
        ? parseInt(authorizedPersonCurrentScreen, 10)
        : 0,
    };
  }

  return {
    kycOfficerCurrentScreen: 0,
    authorizedPersonCurrentScreen: 0,
  };
});

export const selectUploadProgress = (state) => state.kyc.uploadStatus;

export const selectIsRequesting = (state) => state.kyc.isRequesting;

export const selectdropdownData = (state) => state.kyc.dropdownData;

export const selectPaymentAccountsData = (state) => state.kyc.paymentAccountsData;

export const selectPaymentAccounts = createSelector(
  [selectPaymentAccountsData],
  (paymentAccountsData) => {
    if (paymentAccountsData?.data) {
      return paymentAccountsData.data;
    }

    return [];
  }
);

export const selectUploadStatus = (state) => state.kyc?.uploadStatus;
export const selectUploadedFiles = (state) => state.kyc.filesUploaded;

export const selectKYCApprovalStatus = createSelector(
  [selectCurrentEntityGroup],
  (currentEntityGroup) =>
    currentEntityGroup?.entity?.kyc?.status === kycOnboardingStatusEnum.APPROVED
);

export const selectElmUser = (state) => state.kyc.elmUser;
