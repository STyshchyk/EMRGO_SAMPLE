import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ReadOnlyInputField from '../ReadOnlyInputField';

import style from './style.module.scss';

const TermsheetData = ({ data }) => {
  const { t } = useTranslation(['translation', 'termsheet']);

  const fallbackStringValue = t('termsheet:NA');

  return (
    <Fragment>
      <p className={style.sectionHeading}>{t('termsheet:Key Commercial Terms')}</p>
      <ReadOnlyInputField name="securityShortName" label={t('termsheet:Security Short Name')} value={data?.securityShortName ?? fallbackStringValue} />
      <ReadOnlyInputField name="securityLongName" label={t('termsheet:Security Long Name')} value={data?.securityLongName ?? fallbackStringValue} />
      <ReadOnlyInputField name="issuanceName" label={t('termsheet:Issuance Name')} value={data?.name ?? fallbackStringValue} />
      <ReadOnlyInputField name="ticker" label={t('termsheet:Ticker')} value={data?.ticker ?? fallbackStringValue} />
      <ReadOnlyInputField name="isin" label={t('termsheet:ISIN')} value={data?.isin ?? fallbackStringValue} />
      <ReadOnlyInputField name="exchangeCode" label={t('termsheet:Exchange Code')} value={data?.exchangeCode ?? fallbackStringValue} />
      <ReadOnlyInputField name="obligor" label={t('termsheet:Obligor')} value={data?.obligor?.group?.entity?.corporateEntityName ?? fallbackStringValue} />
      <ReadOnlyInputField name="currencyName" label={t('termsheet:Currency')} value={data?.currencyName ?? fallbackStringValue} />
      <ReadOnlyInputField name="issuanceAmount" label={t('termsheet:Issuance Amount')} value={data?.issuanceAmount ?? fallbackStringValue} />
      <ReadOnlyInputField name="denominationName" label={t('termsheet:Denomination')} value={data?.denominationName ?? fallbackStringValue} />
      <ReadOnlyInputField name="certificateCount" label={t('termsheet:Number of Certificates')} value={data?.certificateCount ?? fallbackStringValue} />
      <ReadOnlyInputField name="issuePrice" label={t('termsheet:Issue Price')} value={data?.issuePrice ?? fallbackStringValue} />
      <ReadOnlyInputField name="tradeDate" label={t('termsheet:Trade Date')} value={data?.tradeDate ?? fallbackStringValue} />
      <ReadOnlyInputField name="issueDate" label={t('termsheet:Issue Date')} value={data?.issueDate ?? fallbackStringValue} />
      <ReadOnlyInputField name="maturityDate" label={t('termsheet:Maturity Date')} value={data?.maturityDate ?? fallbackStringValue} />
      <ReadOnlyInputField name="sukukTypeName" label={t('termsheet:Type of Sukuk Issuance')} value={data?.sukukTypeName ?? fallbackStringValue} />
      <ReadOnlyInputField name="hybridSukukType" label={t('termsheet:Hybrid Sukuk Type')} value={data?.hybridSukukType ?? fallbackStringValue} />
      <ReadOnlyInputField name="underlyingAssets" label={t('termsheet:Underlying Assets')} value={data?.underlyingAssets ?? fallbackStringValue} />
      <ReadOnlyInputField name="maturityAmount" label={t('termsheet:Maturity Amount')} value={data?.maturityAmount ?? fallbackStringValue} />
      <ReadOnlyInputField name="profitRateTermsName" label={t('termsheet:Profit Rate Terms')} value={data?.profitRateTermsName ?? fallbackStringValue} />
      <p className={style.lightText}>{t('termsheet:Fixed')}</p>
      <ReadOnlyInputField name="profitRate" label={t('termsheet:Profit Rate')} value={data?.profitRate ?? fallbackStringValue} />
      <ReadOnlyInputField name="frequencyName" label={t('termsheet:Frequency')} value={data?.frequencyName ?? fallbackStringValue} />
      <ReadOnlyInputField name="dayCountConventionName" label={t('termsheet:Day Count Convention')} value={data?.dayCountConventionName ?? fallbackStringValue} />
      <p className={style.sectionHeading}>{t('termsheet:Primary Distribution Considerations')}</p>
      <ReadOnlyInputField name="distributionMethodName" label={t('termsheet:Distribution Method')} value={data?.distributionMethodName ?? fallbackStringValue} />
      <ReadOnlyInputField name="arranger" label={t('termsheet:Lead Manager/Arranger')} value={data?.arrangerDetails?.group.entity.corporateEntityName ?? fallbackStringValue} />
      <ReadOnlyInputField name="sellingRestrictionsName" label={t('termsheet:Selling Restrictions')} value={data?.sellingRestrictionsName ?? fallbackStringValue} />
      <ReadOnlyInputField name="pricingMethod" label={t('termsheet:Pricing Method')} value={data?.pricingName ?? fallbackStringValue} />
      <p className={style.sectionHeading}>{t('termsheet:Other Terms')}</p>
      <ReadOnlyInputField name="guarantor" label={t('termsheet:Guarantor')} value={data?.guarantor ?? fallbackStringValue} />
      <ReadOnlyInputField name="formOfOfferingName" label={t('termsheet:Form of Offering / Issue Format')} value={data?.formOfOfferingName ?? fallbackStringValue} />
      <ReadOnlyInputField name="useOfProceedsName" label={t('termsheet:Use of Proceeds')} value={data?.useOfProceedsName ?? fallbackStringValue} />
      <ReadOnlyInputField name="shariahComplianceName" label={t('termsheet:Shariah Compliance')} value={data?.shariahComplianceName ?? fallbackStringValue} />
      <ReadOnlyInputField name="rankingName" label={t('termsheet:Ranking')} value={data?.rankingName ?? fallbackStringValue} />
      <ReadOnlyInputField name="listingName" label={t('termsheet:Listing')} value={data?.listingName ?? fallbackStringValue} />
      <ReadOnlyInputField name="ratingName" label={t('termsheet:Rating')} value={data?.ratingName ?? fallbackStringValue} />
      <ReadOnlyInputField name="governingLawName" label={t('termsheet:Governing Law')} value={data?.governingLawName ?? fallbackStringValue} />
      <ReadOnlyInputField name="jurisdictionName" label={t('termsheet:Relevant Courts / Jurisdiction for Arbitration')} value={data?.jurisdictionName ?? fallbackStringValue} />
    </Fragment>
  );
};

TermsheetData.propTypes = {
  // sukukId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    certificateCount: PropTypes.string,
    corporateEntityName: PropTypes.string,
    currencyName: PropTypes.string,
    dayCountConventionName: PropTypes.string,
    denominationName: PropTypes.string,
    distributionMethodName: PropTypes.string,
    exchangeCode: PropTypes.string,
    formOfOfferingName: PropTypes.string,
    frequencyName: PropTypes.string,
    governingLawName: PropTypes.string,
    guarantor: PropTypes.string,
    isin: PropTypes.string,
    issuanceAmount: PropTypes.string,
    issueDate: PropTypes.string,
    issuePrice: PropTypes.string,
    jurisdictionName: PropTypes.string,
    listingName: PropTypes.string,
    maturityAmount: PropTypes.string,
    maturityDate: PropTypes.string,
    name: PropTypes.string,
    hybridSukukType: PropTypes.string,
    pricingName: PropTypes.string,
    profitRate: PropTypes.string,
    profitRateTermsName: PropTypes.string,
    rankingName: PropTypes.string,
    ratingName: PropTypes.string,
    securityLongName: PropTypes.string,
    securityShortName: PropTypes.string,
    sellingRestrictionsName: PropTypes.string,
    shariahComplianceName: PropTypes.string,
    sukukTypeName: PropTypes.string,
    ticker: PropTypes.string,
    tradeDate: PropTypes.string,
    underlyingAssets: PropTypes.string,
    useOfProceedsName: PropTypes.string,
    // arrangerDetails: PropTypes.object({}) ???
  }).isRequired,
};

export default TermsheetData;
