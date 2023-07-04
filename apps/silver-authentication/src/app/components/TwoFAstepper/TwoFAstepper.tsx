import * as React from "react";
import { FC } from "react";

import { Button, RadioButton } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Heading, OneCol, SubHeading } from "../Form";
import { TwoFactorAuth } from "../TwoFactorAuth";
import * as Styles from "./TwoFAstepper.styles";
import { ITwoFAstepperProps } from "./TwoFAstepper.types";

const steps = ["Select campaign settings", "Create an ad group", "Create an ad"];

export const TwoFAstepper: FC<ITwoFAstepperProps> = ({ mode, secret, otpauth_url }) => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [nextStep, setNextStep] = React.useState(true);
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Styles.TwoFAstepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && (
            <Styles.SelectOption>
              <div>
                <Heading>Secure your account</Heading>
                <SubHeading>
                  Secure your account with two-factor authentication using your phone number or
                  authentication app
                </SubHeading>
              </div>
              <OneCol>
                <RadioButton
                  name="options"
                  onChange={() => {
                    setNextStep(false);
                  }}
                >
                  From your authenticator app
                </RadioButton>
              </OneCol>

              <OneCol>
                {/*<Button size="large" disabled={false} onClick={handleNext}>*/}
                {/*  Next*/}
                {/*</Button>*/}
                <Button onClick={handleNext} disabled={nextStep} type={"submit"}>
                  Next
                </Button>
              </OneCol>
            </Styles.SelectOption>
          )}

          {activeStep === 1 && (
            <TwoFactorAuth
              position={"relative"}
              secret={secret}
              otpauth_url={otpauth_url}
              mode={mode}
            />
          )}

          {/*<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>*/}
          {/*  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>*/}
          {/*    Back*/}
          {/*  </Button>*/}
          {/*  <Box sx={{ flex: "1 1 auto" }} />*/}
          {/*  {isStepOptional(activeStep) && (*/}
          {/*    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>*/}
          {/*      Skip*/}
          {/*    </Button>*/}
          {/*  )}*/}
          {/*  <Button onClick={handleNext}>*/}
          {/*    {activeStep === steps.length - 1 ? "Finish" : "Next"}*/}
          {/*  </Button>*/}
          {/*</Box>*/}
        </React.Fragment>
      )}
    </Styles.TwoFAstepper>
  );
};
