import { FC } from "react";

import { Button, Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { KYCSectionItem } from "../../components/KYCSectionItem";
import { Heading, SubHeading } from "../../components/Shared";
import { useKYCContext } from "./KYC.provider";
import * as Styles from "./KYC.styles";
import { IKYCProps } from "./KYC.types";

export const KYCComponent: FC<IKYCProps> = (props: IKYCProps) => {
  const { firstName, forms, onStartForm, onSubmit } = ensureNotNull(useKYCContext());
  const firstIncompleteForm = forms?.find((form) => form.hasCompleted === false);

  const areAllSectionsComplete = forms?.every((forms) => forms.hasCompleted);

  return (
    <Styles.KYC>
      <Logo />
      <div>
        <Heading>Hi {firstName}. Complete your KYC to be eligible to make trades</Heading>
        <SubHeading>Once completed, you will be able to make transactions.</SubHeading>
      </div>

      {forms?.map((form) => (
        <KYCSectionItem key={form.id} {...form} />
      ))}

      <div>
        {!areAllSectionsComplete && (
          <Button
            size="large"
            onClick={() =>
              onStartForm(
                firstIncompleteForm?.formId || "",
                firstIncompleteForm?.formReferenceId || ""
              )
            }
          >
            Start {firstIncompleteForm?.label}
          </Button>
        )}

        {areAllSectionsComplete && (
          <Button size="large" onClick={onSubmit}>
            Submit KYC
          </Button>
        )}
      </div>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.KYC>
  );
};
