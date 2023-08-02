import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import { Formik } from "formik";
import PropTypes from "prop-types";

import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import DocumentViewer from "../../../components/DocumentViewer";
import Flex from "../../../components/Flex";
import LoadingIndicator from "../../../components/LoadingIndicator";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const SubPageTitle = ({ text }) => (
  <h3
    style={{
      fontSize: 25,
      color: "#23389c",
      fontWeight: "bold",
      borderBottom: "5px solid #28CCBF",
      display: "inline-block",
    }}
  >
    {text}
  </h3>
);

SubPageTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

// TODO - IMPLEMENT AN USEEFFECT CALLBACK FOR FETCHING OBLIGOR CLIENT AGREEMENT PDF ON MOUNT
const ObligorEngagementEngage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["wethaqengagement"]);
  const mtableLocalization = useMaterialTableLocalization();
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const corporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const engagementObligorProposalDocURL = useSelector(
    issuanceSelectors.selectEngagementObligorProposalSignedDocURL
  );
  const isFetchingEngagementObligorProposalDocURL = useSelector(
    issuanceSelectors.selectFetchingEngagementObligorProposalSignedDocURL
  );

  useEffect(() => {
    const fetchEngagementObligorProposalURL = () =>
      dispatch(issuanceActionCreators.doFetchEngagementObligorProposal());

    fetchEngagementObligorProposalURL();
  }, [dispatch]);

  return (
    <Fragment>
      <SubPageTitle text={t("wethaqengagement:Engagement Letter")} />
      <p>
        {t(
          "wethaqengagement:Please review and agree to this Engagement Letter if you wish to proceed to this stage of the platform"
        )}
        .
      </p>
      <Fragment>
        {isFetchingEngagementObligorProposalDocURL ? (
          <LoadingIndicator />
        ) : (
          <DocumentViewer documentURL={engagementObligorProposalDocURL} />
        )}
      </Fragment>
      <SubPageTitle text={t("wethaqengagement:Rate Card")} />
      <p>
        {t(
          "wethaqengagement:These are the rates corresponding to the services you are engaging us for pursuant to the Engagement Letter"
        )}
      </p>
      <MaterialTable
        columns={[
          {
            title: t("wethaqengagement:Table.Service"),
            field: "service",
          },

          { title: t("wethaqengagement:Table.Service Description"), field: "serviceDescription" },
          {
            title: t("wethaqengagement:Table.Fee Details"),
            field: "feeDetails",
          },
          {
            title: t("wethaqengagement:Table.Fees"),
            field: "feesAmount",
          },
        ]}
        data={[]}
        options={{
          showTitle: false,
          toolbarButtonAlignment: "right",
          draggable: false,
          headerStyle: {
            fontWeight: "bold",
            color: "#23389c",
            fontSize: "1rem",
          },
        }}
        localization={mtableLocalization}
      />
      <div style={{ padding: `30px 0` }}>
        <Formik
          isInitialValid={false}
          initialValues={{ acceptEngagementLetter: false }}
          onSubmit={
            async (/* values, actions */) => {
              // Mock onSubmit handler function
              setSubmitting(true);
              await sleep(2500);
              setSubmitting(false);
              setSubmitted(true);
            }
          }
        >
          {({ handleSubmit, values }) => (
            <form noValidate>
              <Checkbox
                label={t(
                  `wethaqengagement:By clicking this button you, as the Authorised Person of the`,
                  { corporateEntityName }
                )}
                name="acceptEngagementLetter"
              />
              <Flex style={{ width: "100%", padding: `30px 0` }}>
                {submitted ? (
                  <Button disabled style={{ width: `100%`, marginTop: 30 }}>
                    {t("wethaqengagement:The form was submitted successfully")}
                  </Button>
                ) : (
                  <Button
                    disabled={!values.acceptEngagementLetter || isSubmitting}
                    style={{ width: `100%`, marginTop: 30 }}
                    onClick={handleSubmit}
                  >
                    {isSubmitting
                      ? t("wethaqengagement:Please wait")
                      : t("wethaqengagement:Engage")}
                  </Button>
                )}
              </Flex>
            </form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
};

export default ObligorEngagementEngage;
