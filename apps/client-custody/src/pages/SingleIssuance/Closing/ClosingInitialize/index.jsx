import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Form, Formik } from "formik";

import Button from "../../../../components/Button";
import Checkbox from "../../../../components/Checkbox";
import InfoAlert from "../../../../components/InfoAlert";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import { lcClosingFormSchema } from "../../../../validationSchemas";
import SignoffStatusTable from "../SignoffStatusTable";

const generateInitialValues = (data) => ({
  hasDueDiligence: data?.hasDueDiligence,
  hasConditionsPrecedent: data?.hasConditionsPrecedent,
});

const ClosingInitialize = () => {
  const { t } = useTranslation(["closing"]);
  const dispatch = useDispatch();
  const { issuanceID } = useParams();

  // selectors
  const allClosingSignoffData = useSelector(issuanceSelectors.selectAllClosingSignoffData);
  const signingPreActionData = useSelector(issuanceSelectors.selectSigningPreActionData);
  const isFetchingClosingData = useSelector(issuanceSelectors.selectFetchingClosingData);
  const privatePlacementIssuanceStatusObject = useSelector(
    issuanceSelectors.selectPrivatePlacementIssuanceStatusObject
  );
  const providers = useSelector(issuanceSelectors.selectIssuanceOverviewProviders);
  const userId = useSelector(authSelectors.selectUserId);

  const currentHiredLegalCounsels = providers.filter(
    (provider) => provider?.name?.user?.id === userId
  );
  // the same LC might be hired by obl/iss/arr when one-to-one mappings removed
  const hiredByEntityTypes = currentHiredLegalCounsels.map((el) => el?.hiredByEntityType);
  const isLCHiredByArranger = hiredByEntityTypes.includes("ARRANGER");
  const hasInitializedClosing =
    signingPreActionData?.hasDueDiligence && signingPreActionData?.hasConditionsPrecedent;
  const hasRequestedSignoffFromAllParties = allClosingSignoffData.reduce(
    (acc, next) => acc && next?.signOffStatus !== "--",
    true
  );
  const hasReceivedAllSignOffsFromAllParties = allClosingSignoffData.reduce(
    (acc, next) => acc && next?.signOffStatus === "Signoff Complete",
    true
  );

  useEffect(() => {
    const fetchClosingData = (payload) =>
      dispatch(issuanceActionCreators.doFetchClosingData(payload));

    fetchClosingData({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  useEffect(() => {
    const fetchPreActions = (payload) =>
      dispatch(issuanceActionCreators.doSigningFetchPreAction(payload));
    fetchPreActions({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  if (isFetchingClosingData) return <LoadingPage />;

  return (
    <Fragment>
      <PageTitle title={t("closing:LC - Closing")} />
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Formik
          initialValues={generateInitialValues(signingPreActionData)}
          enableReinitialize
          validationSchema={lcClosingFormSchema}
          onSubmit={async (values) => {
            const initializeClosing = (payload) =>
              dispatch(issuanceActionCreators.doInitializeClosing(payload));

            initializeClosing({
              sukukId: issuanceID,
              ...values,
            });
          }}
        >
          {({ values }) => {
            // isValid formik prop is unreliable
            const areAllTheFieldsSetToTrue =
              values?.hasConditionsPrecedent && values?.hasDueDiligence;

            return (
              <Form>
                <div
                  style={{
                    marginBottom: "1rem",
                  }}
                  data-testid="closing-form"
                >
                  <h4
                    style={{
                      background: "#d0d6e2",
                      padding: "0.25em 0.5em",
                      borderRadius: "5px",
                      marginBottom: "1rem",
                    }}
                  >
                    {t("closing:Due Diligence")}
                  </h4>
                  <Checkbox
                    label={t("closing:Due Diligence")}
                    name="hasDueDiligence"
                    readOnly={hasInitializedClosing || !isLCHiredByArranger}
                  />

                  <h4
                    style={{
                      background: "#d0d6e2",
                      padding: "0.25em 0.5em",
                      borderRadius: "5px",
                      marginBottom: "1rem",
                    }}
                  >
                    {t("closing:Conditions Precedent")}
                  </h4>
                  <Checkbox
                    label={t("closing:All Conditions Precedent have been met")}
                    name="hasConditionsPrecedent"
                    readOnly={hasInitializedClosing || !isLCHiredByArranger}
                  />
                </div>

                <h4
                  style={{
                    background: "#d0d6e2",
                    padding: "0.25em 0.5em",
                    borderRadius: "5px",
                    marginBottom: "1rem",
                  }}
                >
                  {t("closing:Co-ordinate Signoffs")}
                </h4>

                <SignoffStatusTable tableData={allClosingSignoffData} />
                <div
                  style={{
                    margin: "1rem 0",
                  }}
                >
                  {privatePlacementIssuanceStatusObject.Closing === "completed" ? (
                    <InfoAlert text={t("closing:The Transaction Has Closed")} />
                  ) : (
                    <Fragment>
                      {hasInitializedClosing ? (
                        <Fragment>
                          {hasRequestedSignoffFromAllParties ? (
                            <Button
                              disabled={
                                !hasReceivedAllSignOffsFromAllParties || !isLCHiredByArranger
                              }
                              variant="contained"
                              fullWidth
                              color="primary"
                              onClick={() => {
                                const completeClosing = (payload) =>
                                  dispatch(issuanceActionCreators.doCompleteClosing(payload));

                                completeClosing({
                                  sukukId: issuanceID,
                                });
                              }}
                              data-testid="complete-closing-btn"
                            >
                              {hasReceivedAllSignOffsFromAllParties
                                ? t("closing:Confirm to All Parties that Closing is complete")
                                : t("closing:Signoffs Pending")}
                            </Button>
                          ) : (
                            <Button
                              disabled={!hasInitializedClosing || !isLCHiredByArranger}
                              variant="contained"
                              fullWidth
                              color="primary"
                              onClick={() => {
                                const requestClosingSignoffFromAllParties = (payload) =>
                                  dispatch(issuanceActionCreators.doRequestClosing(payload));

                                requestClosingSignoffFromAllParties({
                                  sukukId: issuanceID,
                                  Request,
                                });
                              }}
                              data-testid="request-signoff-btn"
                            >
                              {t("closing:Request Signoff from All Parties")}
                            </Button>
                          )}
                        </Fragment>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          color="primary"
                          type="submit"
                          disabled={!areAllTheFieldsSetToTrue}
                        >
                          {t("closing:Initiate Closing of the Transaction")}
                        </Button>
                      )}
                    </Fragment>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Fragment>
  );
};

export default ClosingInitialize;
