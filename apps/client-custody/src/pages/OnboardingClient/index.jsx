import { Fragment, useState } from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button, CardActionArea, CardActions, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import AboutUs from "../../components/AboutUs/AboutUs";
import PageTitle from "../../components/PageTitle";
import useQuery from "../../hooks/useQuery";
import * as selectors from "../../redux/selectors/onboarding";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#E8E8E9",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));
const enitityIdDetails = [
  {
    formId: "1",
    formReferenceId: "1",
    id: "1",
    label: "KYC",
    hasCompleted: false,
    timeRemaining: "5",
  },
  {
    formId: "2",
    formReferenceId: "2",
    id: "2",
    label: "Onboarding Package (FATCA, CRS, Regulatory Forms)",
    hasCompleted: false,
    timeRemaining: "5",
  },
];

const OnboardingClient = () => {
  const { t } = useTranslation(["onboarding"]);
  const queryParams = useQuery();
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const [formPage, setFormPage] = useState(1);
  const dispatch = useDispatch();
  const [isAboutCustodyDisplayed, setIsAboutCustodyDisplayed] = useState(true);
  const { country, restrictedJurisdiction } = useSelector(selectors.selectDropdowns);
  const isFetchingDropdownOptions = useSelector(selectors.selectisFetchingDropdowns);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <PageTitle title={"Regulatory Onboarding"} />
            <Stack spacing={2}>
              {enitityIdDetails &&
                enitityIdDetails.map((item) => {
                  return <Item key={item.id}>{item.label}</Item>;
                })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      {isAboutCustodyDisplayed && (
        <Grid item xs={6}>
          <AboutUs
            onClose={() => {
              setIsAboutCustodyDisplayed(false);
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default OnboardingClient;
