import { FC } from "react";

import { Button, Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { KYCSectionItem } from "../../components/KYCSectionItem";
import { Heading, SubHeading } from "../../components/Shared";
import { useInvestmentProfileContext } from "./InvestmentProfile.provider";
import * as Styles from "./InvestmentProfile.styles";
import { IInvestmentProfileProps } from "./InvestmentProfile.types";

export const InvestmentProfileComponent: FC<IInvestmentProfileProps> = (
  props: IInvestmentProfileProps
) => {
  const { firstName, forms, onStartForm, onSubmit } = ensureNotNull(useInvestmentProfileContext());

  const firstIncompleteForm = forms?.find((form) => form.hasCompleted === false);

  const areAllSectionsComplete = forms?.every((forms) => forms.hasCompleted);

  return (
    <Styles.InvestmentProfile>
      <Logo />
      <div>
        <Heading>Hi {firstName}. Let’s finish creating your investing profile</Heading>
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
            Submit Investment Profile
          </Button>
        )}
      </div>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.InvestmentProfile>
  );
};
