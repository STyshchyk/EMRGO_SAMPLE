import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { v4 as uuidv4 } from "uuid";

import TabGroup from "../../components/TabGroup";
import routes from "../../constants/routes";
import { doBlotterCreateRequest } from "../../redux/actionCreators/paymentAndSettlement";
import { selectCurrentEntityGroup, selectUserId } from "../../redux/selectors/auth";
import { selectBlotters } from "../../redux/selectors/paymentAndSettlement";
// import IssuanceOverview from '../IssuanceOverview';
import BlotterContainer from "../BlotterContainer";

const BlotterView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "blotter"]);
  const blotters = useSelector(selectBlotters);
  const userID = useSelector(selectUserId);
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);

  const currentGroupId = currentEntityGroup?.id;

  const createNewBlotter = () => {
    if (blotters.length < 2) {
      const blotterList = [
        ...blotters,
        {
          id: uuidv4(),
          userId: userID,
          key: {
            parameters: {
              name: t("Blotter:Default Blotter"),
              filters: {},
              manualColumnMove: [],
            },
          },
        },
      ];

      const blotterConfig = blotterList.map((blotter) => ({
        id: blotter.id,
        key: JSON.stringify(blotter.key),
      }));

      const requestObject = {
        data: {
          blotters: [...blotterConfig],
        },
        params: {
          currentGroupId,
        },
      };

      dispatch(doBlotterCreateRequest(requestObject));
    }
  };

  return (
    <Fragment>
      <TabGroup
        routes={[
          {
            link: routes.dashboard.blotters.home,
            text: t("Minor Navigation.Blotter.Overview"),
          },
        ]}
        primaryAction={
          <Tooltip
            title={blotters.length === 2 ? t("blotter:Only two Blotters are allowed per user") : ""}
          >
            <span>
              <Button
                disabled={blotters.length === 2}
                variant="outlined"
                color="secondary"
                onClick={() => createNewBlotter()}
                startIcon={<AddIcon />}
              >
                {t("blotter:Add Blotter")}
              </Button>
            </span>
          </Tooltip>
        }
      />
      <Switch>
        <Route exact path={routes.dashboard.blotters.home} component={BlotterContainer} />
      </Switch>
    </Fragment>
  );
};

export default BlotterView;
