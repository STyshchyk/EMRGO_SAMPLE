import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DescriptionIcon from "@mui/icons-material/Description";
import { Typography } from "@mui/material";

import ErrorBanner from "../../../components/ErrorBanner";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as authSelectors from "../../../redux/selectors/auth";

const InvestorInvoicesPage = () => {
  const { t } = useTranslation(["cash_management"]);
  const dispatch = useDispatch();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {}, [dispatch]);

  return (
    <Fragment>
      <ErrorBanner
        title="Page Under Construction"
        description="Investor Invoice Page - Check back later"
      />
    </Fragment>
  );
};

export default InvestorInvoicesPage;
