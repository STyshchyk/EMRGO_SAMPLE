import { createRef, Fragment, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingIndicator from "../../components/LoadingIndicator";
import routes from "../../constants/routes";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import style from "./style.module.scss";

ReactModal.setAppElement("body");

// TODO - REFACTOR THIS COMPONENT TO USE EVENT-QUERY-PARAM-BASED CONDITIONAL RENDERING. IT REQUIRES CHANGING SIGNING API A BIT
// TODO - POSSIBLE EVENT VALUES - PENDING, SUCCESS AND FAILURE eg. /public/signing/:token?event=pending/success/failure

const DocuSignSignature = () => {
  const dispatch = useDispatch();
  const [currentDocusignURL, setCurrentDocusignURL] = useState("");
  const [currentLoadCount, setCurrentLoadCount] = useState(0);
  const { token } = useParams();
  const docusignURL = useSelector(issuanceSelectors.selectDocusignUrl);

  const iframeRef = createRef();

  const handleIframeLoad = () => {
    toast.dismiss();
  };

  useEffect(() => {
    // *FIXME - Update payload object to include callbackURL field
    const fetchAuthlessDocusignLink = (payload) =>
      dispatch(issuanceActionCreators.doFetchAuthlessDocusignLink(payload));

    toast.success("Please wait! Initializing Docusign", 1000);
    fetchAuthlessDocusignLink({ token });
  }, [dispatch, token]);

  useEffect(() => {
    if (docusignURL !== "") {
      setCurrentDocusignURL(docusignURL);
    }
  }, [docusignURL]);

  const handleIframeTask = (e) => {
    if (e.data === "Close Modal") {
      setCurrentDocusignURL("");
      setCurrentLoadCount(3);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleIframeTask);

    return () => window.removeEventListener("message", handleIframeTask);
  }, []);

  return (
    <Fragment>
      <h1>Public DocuSign Signature</h1>
      {currentLoadCount === 3 ? <Navigate to={routes.signing.success} /> : ""}
      {currentDocusignURL === "" ? (
        <LoadingIndicator />
      ) : (
        <iframe
          ref={iframeRef}
          src={currentDocusignURL}
          onLoad={handleIframeLoad}
          title="Emrgo DocuSign - Signing"
          id="docusignIframe"
          className={style.docusign__iframe}
          display="initial"
          // position="relative"
        />
      )}
    </Fragment>
  );
};

export default DocuSignSignature;
