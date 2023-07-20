import { Fragment, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";

import { reverse } from "named-urls";

import MinorNavigation from "../../../components/MinorNavigation";
import accessControlsList from "../../../constants/accessControlsList";
import routes from "../../../constants/routes";
import * as authSelectors from "../../../redux/selectors/auth";

const Details = lazy(() => import("./Details"));

const IndividualKYC = () => {
  const { t } = useTranslation(["kyc"]);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { entityId, individualId } = useParams();

  // const userObject = useSelector(authSelectors.selectAuthenticatedUserObject);
  // const individualId = userObject?.id;
  const { accessControls } = currentEntityGroup;
  // const hasManageKYCAccessControl = currentEntityGroup?.accessControls.some((acl) => acl?.key === 'KYC/Manage');
  // const isAdmin = currentEntityGroup?.entityType === 'EMRGO_SERVICES';
  // const isComplianceOfficer = hasManageKYCAccessControl && isAdmin;

  const entities = [];
  entities.push(currentEntityGroup?.entity);

  const ADMIN_MINOR_NAV_ROUTES = [
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals.individual
        .home,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals.individual
          .home,
        { entityId, individualId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Individuals Details",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
  ];

  return (
    <Fragment>
      <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
      <div style={{ marginTop: "1rem" }}>
        <Switch>
          <Route
            path={
              routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals
                .individual.home
            }
          >
            <Details />
          </Route>
        </Switch>
      </div>
    </Fragment>
  );
};

export default IndividualKYC;
