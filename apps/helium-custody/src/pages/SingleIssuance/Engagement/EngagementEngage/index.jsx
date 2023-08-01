import { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import cx from "classnames";
import useDeepCompareEffect from "use-deep-compare-effect";

import appConfig from "../../../../appConfig";
import AbsherAuthErrorDialog from "../../../../components/AbsherAuthErrorDialog";
import AbsherAuthPromptDialog from "../../../../components/AbsherAuthPromptDialog";
import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import accessControlsList from "../../../../constants/accessControlsList";
import engagementStatus from "../../../../constants/status/serviceProviderEnagement";
// import Iframe from 'react-iframe';

import { useTheme } from "../../../../context/theme-context";
import useAbsherRedirectURLHandler from "../../../../hooks/useAbsherRedirectURLHandler";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import buildElmAuthAPIURL from "../../../../utils/buildElmAuthAPIURL";
import style from "./style.module.scss";

const categories = {
  LEGAL_COUNSEL: "Legal Counsel",
  CORPORATE: "Corporate Service Provider",
  SHARIA: "Sharia Board",
  EMRGO_SERVICES: "Rating Agency",
  FIDUCIARY: "SPE Trustee",
  CAPITAL_MARKET_INSTITUTION: "Capital Market Institution",
};

const EngagementEngage = () => {
  const { issuanceID } = useParams();
  const { t } = useTranslation(["engagements", "auth"]);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const iframeRef = createRef();
  const location = useLocation();

  const [absherURL, setAbsherURL] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [openAbsherAuthenticationErrorDialog, setOpenAbsherAuthenticationErrorDialog] =
    useState(false);
  const [openAbsherAuthenticationPromptDialog, setOpenAbsherAuthenticationPromptDialog] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState("LEGAL_COUNSEL");

  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const coArrangers = useSelector(issuanceSelectors.selectCoArrangers);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const engagementLetterUrl = useSelector(issuanceSelectors.selectEngagementLetterUrl);
  const isFetchingEngagementRequests = useSelector(
    issuanceSelectors.selectFetchingServiceProviders
  );
  const isFetchingLetterUrl = useSelector(issuanceSelectors.selectIsFetchingLetterUrl);
  const isFetchingServiceProviders = useSelector(issuanceSelectors.selectFetchingServiceProviders);
  const isRequesting = useSelector(issuanceSelectors.selectIsRequesting);
  const providers = useSelector(issuanceSelectors.selectServiceProviders);
  const issuanceOverview = useSelector(issuanceSelectors.selectIssuanceOverview);

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEngagementLetterURL = engagementLetterUrl?.url;
  const hasCreateIssuanceACL = currentListOfAcls.includes(accessControlsList.ISSUANCE.create.key);

  // This handler dispatches an action for fetching engagement letter URL if available
  // if (engagementLetterEnabled) handleEngagementLetterUrl(targetProvider.engagementId, targetProvider.id, issuanceID);

  const absherAuthenticationStateObject = useAbsherRedirectURLHandler();

  const handleEngagementLetterUrl = (engagementId, providerId, sukukId) => {
    const fetchEngagementLetterURL = (payload) =>
      dispatch(issuanceActionCreators.doFetchEngagementLetterUrl(payload));
    const requestPayload = { engagementId, id: providerId, sukukId };

    fetchEngagementLetterURL({
      requestPayload,
    });
    setIsSignatureModalOpen(true);
  };

  useEffect(() => {
    const fetchServiceProviders = (payload) =>
      dispatch(issuanceActionCreators.doFetchServiceProviders(payload));
    const fetchCoArrangers = (payload) =>
      dispatch(issuanceActionCreators.doFetchCoArrangers(payload));

    if (hasCreateIssuanceACL) {
      fetchCoArrangers();
    }
    fetchServiceProviders({ id: issuanceID });
  }, [dispatch, hasCreateIssuanceACL, issuanceID]);

  useEffect(() => {
    const handleOnMessage = (e) => {
      if (e.data === "Close Modal") {
        setIsSignatureModalOpen(false);
      }
    };

    window.addEventListener("message", handleOnMessage);

    return () => window.removeEventListener("message", handleOnMessage);
  }, []);

  useDeepCompareEffect(() => {
    if (absherAuthenticationStateObject.status === "success") {
      const fetchServiceProviders = (payload) =>
        dispatch(issuanceActionCreators.doFetchServiceProviders(payload));
      const fetchEngagementLetterURL = (payload) =>
        dispatch(issuanceActionCreators.doFetchEngagementLetterUrl(payload));
      const { engagementId, providerId, transactionId } =
        absherAuthenticationStateObject.queryParamsObject;

      fetchEngagementLetterURL({
        requestPayload: { engagementId, id: providerId, transactionId, sukukId: issuanceID },
        successCallback: () => {
          fetchServiceProviders({ id: issuanceID });
          setIsSignatureModalOpen(true);
        },
      });

      setAbsherURL(null);
    }

    if (absherAuthenticationStateObject.status === "error") {
      setOpenAbsherAuthenticationErrorDialog(true);
    }
  }, [absherAuthenticationStateObject, dispatch, issuanceID]);

  // This handler dispatches an action for requesting an engagement request
  const handleEngagementRequest = (providerEntityId, providerEntityGroupId) => {
    const engageServiceProvider = (payload) =>
      dispatch(issuanceActionCreators.doEngageServiceProvider(payload));

    const payload = {
      sukukId: issuanceID,
      requestPayload: {
        providerEntityId,
        providerEntityGroupId,
      },
    };

    engageServiceProvider(payload);
  };

  // This handler is used for ARR/OBL/ISS to shortcircuit engagement
  const handleFinalizeEngagement = (providerEntityId, providerEntityGroupId) => {
    const finalizeEngagement = (payload) =>
      dispatch(issuanceActionCreators.doEngageServiceProvider(payload));

    const payload = {
      sukukId: issuanceID,
      requestPayload: {
        providerEntityId,
        providerEntityGroupId,
        shouldCountersign: true,
      },
    };

    finalizeEngagement(payload);
  };

  const handleIframeLoad = () => {
    toast.dismiss();
    // if (currentLoadCount < 2) {
    //   setCurrentLoadCount(currentLoadCount + 1);
    // } else {
    //   setIsSignatureModalOpen(false);
    //   setCurrentLoadCount(0);
    // }
  };

  //
  const getNavButtons = () => {
    const buttons = [];

    // Remove Corporate Service Providers, Shariah Board & Rating Agency.
    Object.keys(categories)
      .filter((category) =>
        ["LEGAL_COUNSEL", "FIDUCIARY", "CAPITAL_MARKET_INSTITUTION"].includes(category)
      )
      .forEach((category) => {
        buttons.push(
          <button
            type="button"
            key={category}
            className={cx(
              style.navButton,
              selectedCategory === category ? style.selected : "",
              theme.locale.rtl ? style.navButton__right : style.navButton__left
            )}
            onClick={() => setSelectedCategory(category)}
          >
            <p>{t(`engagements:Categories.${categories[category]}`)}</p>
          </button>
        );
      });

    return buttons;
  };

  const generateCoArrangerEngagementRequestComponents = (coArrangersList) => {
    const coArrangerEngagementRequestComponents = [];

    if (!coArrangersList) return null;

    const filteredCoArrangers = coArrangers.filter(
      (item) => item.entity?.corporateEntityName !== currentCorporateEntityName
    );

    // Extract an engaged CoArranger object from issuance overview API data if it exists
    const engagedCoArranger = issuanceOverview.projectTeam?.find(
      ({ entityType }) => entityType === "CO_ARRANGER"
    );

    if (Array.isArray(filteredCoArrangers) && filteredCoArrangers.length) {
      filteredCoArrangers.forEach((item) => {
        coArrangerEngagementRequestComponents.push(
          <div key={item.id} className={style.serviceProviderWrapper}>
            <h3 className={style.entityName}>{item.entity?.corporateEntityName}</h3>
            <div className={style.actionWrapper}>
              <Button
                onClick={() => {
                  const addCoArranger = (payload) =>
                    dispatch(issuanceActionCreators.doAddCoArranger(payload));
                  const fetchIssuanceOverview = (payload) =>
                    dispatch(issuanceActionCreators.doFetchIssuanceOverview(payload));

                  const requestPayload = {
                    coArrangerEntityGroupId: item.id,
                  };
                  addCoArranger({
                    sukukId: issuanceID,
                    requestPayload,
                    successCallback: () => {
                      fetchIssuanceOverview({ sukukId: issuanceID });
                    },
                  });
                }}
                type="button"
                disabled={item.id === engagedCoArranger?.id || isRequesting}
              >
                Finalize Engagement
              </Button>
            </div>
          </div>
        );
      });
    }

    return coArrangerEngagementRequestComponents;
  };

  const getServiceProviders = (providerCategory, serviceProvidersList) => {
    if (!serviceProvidersList) return null;

    // coArrangers
    const serviceProviderRowItems = [];
    const listOfTargetProviders = serviceProvidersList[providerCategory] ?? [];

    if (Array.isArray(listOfTargetProviders) && listOfTargetProviders.length) {
      listOfTargetProviders.forEach((item) => {
        const { status, entity /* ,name */ } = item;

        const requestEnabled = !status || engagementStatus[status] < 1;
        const engagementLetterEnabled = status && engagementStatus[status] >= 4;
        const isAbsherAuthenticationRequired =
          appConfig.appRegion === "SA" && status && engagementStatus[status] === 4;

        const hasSentEngagementRequest = status && engagementStatus[status] >= 1;
        const isCounterSigned = status && engagementStatus[status] >= 4;
        const hasEngagementFile = item?.engagementFileId !== "";

        serviceProviderRowItems.push(
          <div key={item.id} className={style.serviceProviderWrapper}>
            {/* <h4 className={style.entityName}>{name}</h4> */}
            <h3 className={style.entityName}>{entity.corporateEntityName}</h3>
            <div className={style.actionWrapper}>
              {/*
                  <Button disabled>{t('engagements:Buttons.Message')}</Button>
              */}
              <Button
                onClick={() => {
                  handleEngagementRequest(item.entityId, item.id);
                }}
                disabled={!requestEnabled}
              >
                {t("engagements:Buttons.Send Engagement Request")}
              </Button>

              <Button
                onClick={() => {
                  if (isAbsherAuthenticationRequired) {
                    const { origin } = window.location;
                    const redirectURL = new URL(`${origin}${location.pathname}`);

                    redirectURL.searchParams.append("state", "success");
                    redirectURL.searchParams.append("engagementId", `${item.engagementId}`);
                    redirectURL.searchParams.append("providerId", `${item.id}`);

                    const newElmAuthURL = buildElmAuthAPIURL(
                      redirectURL.href,
                      `${origin}${location.pathname}?state=error`,
                      currentEntityGroupID
                    );
                    setAbsherURL(newElmAuthURL);
                    setOpenAbsherAuthenticationPromptDialog(true);
                  } else if (engagementLetterEnabled)
                    handleEngagementLetterUrl(item.engagementId, item.id, issuanceID);
                }}
                disabled={!isCounterSigned || !hasEngagementFile} // if mentioned might need the shouldCountersign boolean to disable for ARR shortcircuit until upload btn is clicked
                type="button"
              >
                {t("engagements:Buttons.View Engagement Letter")}
              </Button>

              <Button
                onClick={() => {
                  handleFinalizeEngagement(item.entityId, item.id);
                }}
                type="button"
                disabled={isCounterSigned || hasSentEngagementRequest}
              >
                Finalize Engagement
              </Button>
            </div>
          </div>
        );
      });
    } else {
      serviceProviderRowItems.push(
        <h4>
          {t(`engagements:There are currently no service providers available for`, {
            category: categories[providerCategory],
          })}
        </h4>
      );
    }

    return serviceProviderRowItems;
  };

  if (isFetchingEngagementRequests || isFetchingLetterUrl || isFetchingServiceProviders) {
    return <LoadingPage />;
  }

  return (
    <div>
      <h3>{t("engagements:Engage a Service Provider")}</h3>
      <div className={style.providerContainer}>
        <div className={cx(style.sider, theme.locale.rtl ? style.sider__right : style.sider__left)}>
          {getNavButtons()}
        </div>
        <div className={style.listing} data-testid="engagement-serviceproviders">
          {["CAPITAL_MARKET_INSTITUTION"].includes(selectedCategory)
            ? generateCoArrangerEngagementRequestComponents(coArrangers)
            : getServiceProviders(selectedCategory, providers)}
        </div>
      </div>

      <Dialog
        fullWidth
        open={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        maxWidth="lg"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className={style.docusign__modal}>
          <iframe
            ref={iframeRef}
            src={currentEngagementLetterURL}
            onLoad={handleIframeLoad}
            title="docusignIframe"
            id="docusignIframe"
            className={style.docusign__iframe}
            display="initial"
            position="relative"
          />
        </DialogContent>
      </Dialog>
      <AbsherAuthPromptDialog
        open={openAbsherAuthenticationPromptDialog}
        handleClose={() => setOpenAbsherAuthenticationPromptDialog(false)}
        absherURL={absherURL}
      />
      <AbsherAuthErrorDialog
        open={openAbsherAuthenticationErrorDialog}
        handleClose={() => setOpenAbsherAuthenticationErrorDialog(false)}
        absherURL={absherURL}
      />
    </div>
  );
};

export default EngagementEngage;
