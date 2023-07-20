import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { title } from "change-case";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";

const numberIntlFormatOps = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const CouponEventDetails = ({ couponEventData }) => {
  const isPrimaryIssuance = couponEventData?.isPrimaryIssuance;
  const securityName = couponEventData?.security;
  const formattedCouponDate = dateFormatter(couponEventData?.couponDate, DEFAULT_DATE_FORMAT);
  const securityShortName = couponEventData?.shortName; // TODO: FIX MISSING SHORTNAME API DATA FIELD
  const totalHolding = convertNumberToIntlFormat(couponEventData?.externalSecurity?.issuanceAmount);
  const formattedCouponRate = `${convertNumberToIntlFormat(couponEventData?.couponRate, {
    ...numberIntlFormatOps,
  })}%`;
  const dayCountConvention = couponEventData?.dayCountConventionName;
  const frequency = couponEventData?.frequencyName;
  const issuanceCCY = couponEventData?.currencyName;
  const couponAllocationStatus = couponEventData?.couponAllocationStatus;

  const issuerCorporateEntityName = couponEventData?.issuer?.corporateEntityName;
  const issuerAccountNo = couponEventData?.issuer?.wethaqAccount?.accountNo;
  const issuerAccountName = "Issuer Cash Account";
  const issuerAccountBalance = convertNumberToIntlFormat(
    couponEventData?.issuer?.wethaqAccount?.accountBalance,
    numberIntlFormatOps
  );

  const csdSourceAccountNo = couponEventData?.wethaqDebitAccount?.accountNo;
  const csdSourceAccountBalance = couponEventData?.wethaqDebitAccount?.accountBalance;
  const csdSourceAccountType = couponEventData?.wethaqDebitAccount?.type;

  return (
    <Grid container spacing={2}>
      <Grid item container justifyContent="space-between" spacing={1}>
        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Security`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{securityName}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Coupon Date`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{formattedCouponDate}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Security Short Name`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{securityShortName}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Total Holding`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{totalHolding}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Coupon Rate`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{formattedCouponRate}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Coupon Allocation Status`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{couponAllocationStatus}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Day Count`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{dayCountConvention}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Frequency`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{frequency}</Typography>
          </Grid>
        </Grid>

        <Grid item container md={12} justifyContent="space-between">
          <Grid item>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >{`Currency`}</Typography>
          </Grid>
          <Grid item>
            <Typography>{issuanceCCY}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {isPrimaryIssuance ? (
        <Grid item container justifyContent="space-between" spacing={1}>
          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Issuer`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{issuerCorporateEntityName}</Typography>
            </Grid>
          </Grid>

          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Issuer Account`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{issuerAccountNo}</Typography>
            </Grid>
          </Grid>

          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Account Name`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{issuerAccountName}</Typography>
            </Grid>
          </Grid>

          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Issuer Balance`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{issuerAccountBalance}</Typography>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item container justifyContent="space-between" spacing={1}>
          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Source Account`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{csdSourceAccountNo}</Typography>
            </Grid>
          </Grid>

          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Account Name`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{title(csdSourceAccountType)}</Typography>
            </Grid>
          </Grid>

          <Grid item container md={12} justifyContent="space-between">
            <Grid item>
              <Typography
                style={{
                  fontWeight: "bold",
                }}
              >{`Account Balance`}</Typography>
            </Grid>
            <Grid item>
              <Typography>
                {csdSourceAccountBalance &&
                  convertNumberToIntlFormat(csdSourceAccountBalance, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default CouponEventDetails;

const csdAccount = {
  id: "bb31c3e8-be76-49c5-93fb-91024ef78299",
  accountBalance: "-1000.00",
  createdAt: "2022-08-25T06:53:38.655Z",
  updatedAt: "2022-08-25T08:04:21.394Z",
  entityGroupId: "00163f9b-0271-40e0-ab5d-e30cdb2f8a4a",
  currencyId: "24fb462a-af6a-4964-9aec-dbb05ac35f65",
  isVirtualIBAN: true,
  iban: "FO8280887002900146",
  accountNo: "10999992",
  type: "CUSTODY_WASH_ACCOUNT",
  isActive: true,
  isArchived: false,
  lastStatementFetchDate: null,
  externalAccountNumber: null,
};
