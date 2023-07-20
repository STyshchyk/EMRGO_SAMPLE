import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import appConfig from "../appConfig";

// This custom hook handles parsing query params from given
// redirect URL for further processing after Absher authentication flow is concluded
// This hook will run only if appRegion is set to SA

// TODO: Generalize this custom hook

const useAbsherRedirectURLHandler = () => {
  const location = useLocation();
  const history = useNavigate();
  const { pathname, search } = location;
  const [status, setStatus] = useState(null);
  const [queryParamsObject, setQueryParamsObject] = useState(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(search);

    if (!appConfig.appRegion === "SA" || !urlSearchParams.has("state")) return;

    const stateQueryParam = urlSearchParams.get("state");
    setStatus(stateQueryParam);

    if (stateQueryParam === "success") {
      const params = {};

      urlSearchParams.forEach((value, key) => {
        if (key !== "state") params[key] = value;
      });

      setQueryParamsObject({ ...params });
    }

    history.replace({
      pathname,
    });
  }, [history, pathname, search]);

  return {
    status,
    queryParamsObject,
  };
};

export default useAbsherRedirectURLHandler;
