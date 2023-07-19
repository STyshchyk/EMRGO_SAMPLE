import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ReadOnlyInputField from '../ReadOnlyInputField';
import FormSection from '../FormSection';

// TODO: CLEANUP

const IssuerDetailsView = ({ data }) => {
  const { t } = useTranslation(['admission']);
  const getFullName = () => `${data?.firstName || ''} ${data?.middleName || ''} ${data?.lastName || ''}`;

  const directors = data?.entity?.kyc?.directors || [];
  const authorisedSignatories = data?.entity?.kyc?.authorisedSignatories || [];
  const getOperatingAddress = () => {
    const addresses = data?.entity?.kyc?.otherAddresses || [];
    const operatingAddress = addresses.filter((address) => address.type === 'operating');
    if (operatingAddress.length) return operatingAddress[0];
    return {};
  };

  const getDirectors = (dirs) => {
    const boxes = [];
    dirs.forEach((dir) => {
      boxes.push(
        <Fragment>
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.First Name')} name="firstName" value={dir.firstName} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Last Name')} name="lastName" value={dir.lastName} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Director Email Address')} name="email" value={dir.email} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Address Line 1')} name="addressLine1" value={dir.addressLine1} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Address Line 2')} name="addressLine2" value={dir.addressLine2} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Postal Code')} name="pinCode" value={dir.pinCode} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.City')} name="city" value={dir.city} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Country')} name="country" value={dir.country?.name} />
        </Fragment>,
      );
    });
    return boxes;
  };

  const getAuthorisedSignatories = (signs) => {
    const boxes = [];
    signs.forEach((dir) => {
      boxes.push(
        <Fragment>
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.First Name')} name="firstName" value={dir.firstName} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Last Name')} name="lastName" value={dir.lastName} />
          <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Email Address')} name="email" value={dir.email} />
        </Fragment>,
      );
    });
    return boxes;
  };

  return (
    <div>
      <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Full legal name of Issuer')} name="legalName" value={getFullName() || ''} />
      <FormSection title={t('admission:Accordian.Issuance Details.Registered Address')}>
        <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Address Line 1')} name="addressLine1" value={getOperatingAddress().addressLine1} />
        <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Address Line 2')} name="addressLine2" value={getOperatingAddress().addressLine2} />
        <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.City')} name="city" value={getOperatingAddress().city} />
        <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Post Code')} name="pincode" value={getOperatingAddress().pinCode} />
        <ReadOnlyInputField label={t('admission:Accordian.Issuance Details.Form Fields.Country')} name="country" value={getOperatingAddress().country?.name} />
      </FormSection>
      <FormSection title={t('admission:Accordian.Issuance Details.Directors')}>{directors.length ? getDirectors(directors) : <p>{t('admission:Accordian.Issuance Details.N/A')}</p>}</FormSection>
      <FormSection title={t('admission:Accordian.Issuance Details.Authorised Representative(s) (if different from Director(s))')}>
        {directors.length ? getAuthorisedSignatories(authorisedSignatories) : <p>{t('admission:Accordian.Issuance Details.N/A')}</p>}
      </FormSection>
    </div>
  );
};

IssuerDetailsView.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    entity: PropTypes.object,
    arranger: PropTypes.string,
    obligor: PropTypes.string,
  }).isRequired,
};

export default IssuerDetailsView;
