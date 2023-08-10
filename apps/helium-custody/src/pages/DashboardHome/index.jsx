import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import { reverse } from "named-urls";
import PropTypes from "prop-types";

import Button from "../../components/Button";
import MinorNavigation from "../../components/MinorNavigation";
import routes from "../../constants/routes";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as authSelectors from "../../redux/selectors/auth";
import style from "./style.module.scss";

const PageTitle = ({ title }) => <h2 className={style.title}>{title}</h2>;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

const DashboardHome = () => {
  const { t } = useTranslation(["translation", "administration", "kyc"]);
  const dispatch = useDispatch();
  // const navigate = useNavigate();


  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListOfACLs = useSelector(authSelectors.selectCurrentListOfAcls);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const ROUTES = [
    {
      link: reverse(routes.dashboard.home),
      text: "Minor Navigation.Home.Home",
      disabled: false,
    },
  ];

  return (
    <div data-testid="dashboard-home">
      <Grid container justifyContent="space-between">
        <MinorNavigation routes={ROUTES} />
      </Grid>
    </div>
  );
};

export default DashboardHome;
