import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { mdiCheckCircleOutline } from "@mdi/js";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import routes from "../../constants/routes";
import generatePath from "../../helpers/generatePath";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as authSelectors from "../../redux/selectors/auth";
import ActionButton from "../ActionButton";
import ErrorBanner from "../ErrorBanner";
import LoadingIndicator from "../LoadingIndicator";

// import style from './style.module.scss';

const MFAReset = () => {
  const { t } = useTranslation(["auth"]);
  const { token } = useParams();
  const dispatch = useDispatch();
  const hasResetMFA = useSelector(authSelectors.selectHasSuccessfullyResetMFA);

  useEffect(() => {
    const requestPayload = { token };
    const resetMFA = (payload) => dispatch(authActionCreators.doMFAReset(payload));
    resetMFA(requestPayload);
  }, [dispatch, token]);

  return (
    <Grid container direction="column" justifyContent="center" alignContent="center">
      {hasResetMFA ? (
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignContent="center"
          xs={12}
          md={6}
          lg={6}
        >
          <ErrorBanner title="" description="" icon={mdiCheckCircleOutline} />
          <Typography variant="h6" align="center">
            {t("auth:Two Factor Authentication has been reset Please login to setup 2FA again")}
          </Typography>
          <br />
          <ActionButton
            link={generatePath(routes.public.login)}
            text={t("auth:Buttons:Back to Login")}
            hideArrow
            logoColor
          />
        </Grid>
      ) : (
        <Grid item container direction="column" justifyContent="center">
          <LoadingIndicator />
          <Typography variant="h6" align="center">
            {t("auth:Please wait while we reset your Two Factor Authentication")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default MFAReset;
