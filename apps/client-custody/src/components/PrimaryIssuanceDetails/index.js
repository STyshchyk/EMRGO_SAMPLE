import { createContext, useContext } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

import { dateFormatter } from '../../utils/formatter';
import convertNumberToIntlFormat from '../../utils/convertNumberToIntlFormat';
import IssuerDetailsView from '../IssuerDetailsView';
import SecurityAllocationPaymentView from '../SecurityAllocationPaymentView';
import TermsheetData from '../TermsheetData';

const SecuritiesRegistrationDetailsContext = createContext();

const useSecuritiesRegistrationDetailsContext = () => {
  const context = useContext(SecuritiesRegistrationDetailsContext);

  if (!context) {
    throw new Error('useSecuritiesRegistrationDetailsContext hook must be called within a SecuritiesRegistrationDetailsContext.Provider component');
  }

  return context;
};

const getNumberOfCertificates = (issuanceAmount, denominationValue) => {
  let count = 0;

  count = parseInt(issuanceAmount, 10) / parseInt(denominationValue, 10);

  return count;
};

const convertSukukDataToArrayOfObjects = (sukukData) => {
  if (!sukukData) return [];

  const result = [];

  result.push(['Key Commercial Terms', '']);
  result.push(['Obligor', sukukData?.obligor ?? 'N/A']);
  result.push(['Currency', sukukData?.currencyName?.name ?? 'N/A']);
  result.push(['Issuance Amount', convertNumberToIntlFormat(sukukData?.issuanceAmount)]);
  result.push(['Denomination', sukukData?.denominationName?.value ?? 'N/A']);
  result.push(['Number of Certificates', getNumberOfCertificates(sukukData?.issuanceAmount, sukukData?.denominationName?.value)]);
  result.push(['Issue Price', convertNumberToIntlFormat(sukukData?.issuePrice)]);
  result.push(['Trade Date', dateFormatter(sukukData?.tradeDate, 'DD/MM/YYYY HH:MM') || 'N/A']);
  result.push(['Issue Date', dateFormatter(sukukData?.issueDate, 'DD/MM/YYYY HH:MM') || 'N/A']);
  result.push(['Maturity Date', dateFormatter(sukukData?.maturityDate, 'DD/MM/YYYY HH:MM') || 'N/A']);
  result.push(['Type of Sukuk Issuance', sukukData?.sukukTypeName?.name ?? 'N/A']);
  result.push(['Underlying Assets', sukukData?.underlyingAssets ?? 'N/A']);
  result.push(['Maturity Amount', convertNumberToIntlFormat(sukukData?.maturityAmount)]);
  result.push(['Profit Rate Terms', sukukData?.profitRateTermsName?.name ?? 'N/A']);
  result.push(['Fixed', '']);
  result.push(['Profit Rate', convertNumberToIntlFormat(sukukData?.profitRate)]);
  result.push(['Frequency', sukukData?.frequencyName?.name ?? 'N/A']);
  result.push(['Day Count Convention', sukukData?.dayCountConventionName?.name ?? 'N/A']);
  result.push(['Primary Distribution Considerations', '']);
  result.push(['Distribution Method', sukukData?.distributionMethodName?.name ?? 'N/A']);
  result.push(['Lead Manager/Arranger', sukukData?.arranger ?? 'N/A']);
  result.push(['Selling Restrictions', sukukData?.sellingRestrictionsName?.name ?? 'N/A']);
  result.push(['Other Terms', '']);
  result.push(['Guarantor', sukukData?.guarantor ?? 'N/A']);
  result.push(['Form of Offering / Issue Format', sukukData?.formOfOfferingName?.name ?? 'N/A']);
  result.push(['Use of Proceeds', sukukData?.useOfProceedsName?.name ?? 'N/A']);
  result.push(['Shariah Compliance', sukukData?.shariahComplianceName?.name ?? 'N/A']);
  result.push(['Ranking', sukukData?.rankingName?.name ?? 'N/A']);
  result.push(['Listing', sukukData?.listingName?.name ?? 'N/A']);
  result.push(['Rating', sukukData?.ratingName?.name ?? 'N/A']);
  result.push(['Governing Law', sukukData?.governingLawName?.name ?? 'N/A']);
  result.push(['Relevant Courts / Jurisdiction for Arbitration', sukukData?.jurisdictionName?.name ?? 'N/A']);

  return result;
};

export const generateCSDOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }

  return [];
};

// TODO: REPLACE THIS DIRTY SHORTCUT WITH SOME CLEANER LOGIC TO TAKE THE APP REGION INTO ACCOUNT WHEN FETCHING SEC. REGISTRATION DEPOSITORY DOCUMENT LINKS
const OCI_WETHAQ_ASSETS_BUCKET_URL = 'https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/';

const RegistrarAndDepositoryDocuments = () => {
  // TODO: TRANSLATION MAPPINGS

  const REGISTRAR_AND_DEPOSITORY_DOCUMENTS_LIST = [
    {
      name: 'Edaa',
      documentsList: [
        {
          documentName: 'Creation of Securities Ownership Register Services',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-001_Creation_of_Securities_Ownership_Register_Services_v1.docx`,
        },
        {
          documentName: 'ISIN Code Profile',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-002_ISIN_Generation_v1.docx`,
        },
        {
          documentName: 'Coupon Adding Form',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-003_Add_Coupon_v1.docx`,
        },
        {
          documentName: 'Delegation',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-004_Delegation_v1.docx`,
        },

        {
          documentName: 'Issue Profile Form - Debt',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-005_Issue_Profile_v1.docx`,
        },

        {
          documentName: 'Sharebook Record - Debt',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/Edaa-006_Sharebook_Record_v1.docx`,
        },
      ],
    },
    {
      name: 'Tadawul',
      documentsList: [
        {
          documentName: 'IFSAH User form for Debt Instrument',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/TAD-001_IFSAH_User_Form_for_Debt_Instruments_v1.docx`,
        },
        {
          documentName: 'Debt Instrument Information',
          link: `${OCI_WETHAQ_ASSETS_BUCKET_URL}documents/TAD-002_Debt_Instrument_Information_v1.docx`,
        },
      ],
    },
  ];

  return (
    <Grid container spacing={2} direction="column">
      {REGISTRAR_AND_DEPOSITORY_DOCUMENTS_LIST.map(({ name, documentsList }) => (
        <Grid item key={name}>
          <Typography>
            <strong>{name}</strong>
          </Typography>
          <List>
            {documentsList.map(({ documentName, link }) => (
              <ListItem key={documentName} disableGutters>
                <ListItemText disableTypography>
                  <Tooltip title={`Download ${documentName} document`}>
                    <Link href={link} rel="noopener">
                      {documentName}
                    </Link>
                  </Tooltip>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </Grid>
  );
};

const IssuanceTerms = () => {
  const { t } = useTranslation(['admission', 'yup']);
  const { admissionTermsheetData, termsheetInfo } = useSecuritiesRegistrationDetailsContext();

  return (
    <Grid>
      <Typography paragraph>
        {t(
          `admission:Accordian.Issuance Terms.Further to Clause [] (Procedure for admission of Securities) of the Issuer Securities Admission Terms entered into between us as Issuer , the Obligor and you on [insert date] (the “Issuer Terms”), we request that you admit the Securities relating to the Issuance identified below to the Emrgo System`,
          { clause: '2.1.1' },
        )}
        .
      </Typography>
      <Typography paragraph>{t('admission:Accordian.Issuance Terms.Capitalised terms used but not defined herein shall have the meanings given to them in the Issuer Terms')}.</Typography>
      <Typography
        variant="caption"
        paragraph
        style={{
          color: '#afafaf',
        }}
      >
        {t('admission:Accordian.Issuance Terms.The terms below have been confirmed by the Legal Counsel')}.{' '}
        {t('admission:Accordian.Issuance Terms.If you believe any of them are not accurate click to notify your Legal Counsel')}.
      </Typography>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Button color="secondary" size="small">
            {t('admission:Accordian.Issuance Terms.Buttons.Notify Legal Counsel')}
          </Button>
        </Grid>
        <Grid item>
          <CSVLink filename={`${admissionTermsheetData?.sukukData?.name}_termsheet_data.csv`} data={convertSukukDataToArrayOfObjects(admissionTermsheetData?.sukukData)} target="_blank">
            <Button color="disabled" size="small" startIcon={<DescriptionIcon />}>
              {t('admission:Accordian.Issuance Terms.Buttons.Download as CSV')}
            </Button>
          </CSVLink>
        </Grid>
      </Grid>
      {termsheetInfo && <TermsheetData data={termsheetInfo} />}
    </Grid>
  );
};

const IssuerDetails = () => {
  const { admissionTermsheetData } = useSecuritiesRegistrationDetailsContext();

  return <IssuerDetailsView data={admissionTermsheetData.issuerDetails || {}} />;
};

const SecuritiesAllocations = () => {
  const { t } = useTranslation(['admission', 'securitiesRegistration']);
  const { admissionTermsheetData } = useSecuritiesRegistrationDetailsContext();

  return (
    <Grid>
      <Typography paragraph>
        {t(
          'admission:Accordian.Securities Allocations & Payment Instructions.Please review the details below and submit to Issuer for approval & instructions to proceed with securities allocation and payment instructions',
        )}
      </Typography>
      <SecurityAllocationPaymentView subscriptions={admissionTermsheetData.subscriptions || []} sukukData={admissionTermsheetData.sukukData || {}} />
    </Grid>
  );
};

// TODO: @MONCY - UPDATE SECURITIES REGISTRATION CYPRESS TEST SPEC. DO NOT FORGET.

const PrimaryIssuanceDetails = ({ termsheetInfo, admissionTermsheetData, disableDocumentsAccordionItem }) => {
  const { t } = useTranslation(['securitiesRegistration']);

  const value = {
    termsheetInfo,
    admissionTermsheetData,
  };

  const SECTION_DATA_OBJECT_ITEMS = [
    {
      id: 'registrar-depository-documents-header',
      accordionSummary: `${t('securitiesRegistration:PrimaryIssuanceDetails.Sections.Registrar & Depository Documents.Title')}`,
      component: <RegistrarAndDepositoryDocuments />,
      isDisabled: disableDocumentsAccordionItem,
    },
    {
      id: 'issuance-terms-header',
      accordionSummary: `${t('securitiesRegistration:PrimaryIssuanceDetails.Sections.Issuance Terms.Title')}`,
      component: <IssuanceTerms />,
    },
    {
      id: 'issuer-details-header',
      accordionSummary: `${t('securitiesRegistration:PrimaryIssuanceDetails.Sections.Issuer Details.Title')}`,
      component: <IssuerDetails />,
    },
    {
      id: 'securities-allocations-header',
      accordionSummary: `${t('securitiesRegistration:PrimaryIssuanceDetails.Sections.Securities Allocations.Title')}`,
      component: <SecuritiesAllocations />,
    },
  ];

  return (
    <SecuritiesRegistrationDetailsContext.Provider value={value}>
      {SECTION_DATA_OBJECT_ITEMS.filter((i) => !i.isDisabled).map(({ id, accordionSummary, component }, index) => (
        <Accordion key={id} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${accordionSummary}"-content"`} id={id}>
            <Typography gutterBottom>{`${index + 1}. ${accordionSummary}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>{component}</AccordionDetails>
        </Accordion>
      ))}
    </SecuritiesRegistrationDetailsContext.Provider>
  );
};

export default PrimaryIssuanceDetails;
