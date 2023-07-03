import { render } from "@testing-library/react";

import { QuestionnaireItem } from "./QuestionnaireItem";

test("QuestionnaireItem", () => {
  render(<QuestionnaireItem timeRemaining="5 minutes" />);
});
