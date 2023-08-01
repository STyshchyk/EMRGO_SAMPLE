import { toast } from "react-toastify";

import {
  BANK_AMOUNT_DP,
  BANK_RATE_DP,
  CLIENT_AMOUNT_DP,
  CLIENT_RATE_DP,
  MARKUP_AMOUNT_DP,
  MARKUP_RATE_DP,
} from "../constants/currency/availableCurrencies";
import { roundNumber } from "./renderers";

const runRounding = (values, setFieldValue, touched) => {
  // To run rounding on the touched fields
  if (touched.bankRate) {
    setFieldValue("bankRate", roundNumber(values.bankRate, BANK_RATE_DP), true);
  }

  if (touched.markupRate) {
    setFieldValue("markupRate", roundNumber(values.markupRate, MARKUP_RATE_DP), true);
  }

  if (touched.clientRate) {
    setFieldValue("clientRate", roundNumber(values.clientRate, CLIENT_RATE_DP), true);
  }

  if (touched.bankAmount) {
    setFieldValue("bankAmount", roundNumber(values.bankAmount, BANK_AMOUNT_DP), true);
  }

  if (touched.markupAmount) {
    setFieldValue("markupAmount", roundNumber(values.markupAmount, MARKUP_AMOUNT_DP), true);
  }

  if (touched.clientAmount) {
    setFieldValue("clientAmount", roundNumber(values.clientAmount, CLIENT_AMOUNT_DP), true);
  }
};

export const runFxCalculations = ({ values, setFieldValue, touched, incompleteText }) => {
  if (!values.fromAmount) {
    toast.error(incompleteText, 1000);
    return false;
  }

  // Rounding of all the fields
  runRounding(values, setFieldValue, touched);

  // BRD Ref https://wethaq.atlassian.net/wiki/spaces/WS/pages/272302081/International+Securities+Phase+3+BRD#4.2--Proposed-Business-Process-(To-Be)
  // #1
  if (values.bankRate && values.markupRate) {
    const clientRate = values.bankRate - values.markupRate;
    if (!touched.clientRate) {
      setFieldValue("clientRate", roundNumber(clientRate, CLIENT_RATE_DP), true);
    }

    if (!touched.markupAmount) {
      const markupAmount = Number(values.fromAmount) * values.markupRate;
      setFieldValue("markupAmount", roundNumber(markupAmount, MARKUP_AMOUNT_DP), true);
    }

    if (!touched.bankAmount) {
      const bankAmount = Number(values.fromAmount) * values.bankRate;
      setFieldValue("bankAmount", roundNumber(bankAmount, BANK_AMOUNT_DP), true);
    }

    if (!touched.clientAmount) {
      const clientAmount = Number(values.fromAmount) * clientRate;
      setFieldValue("clientAmount", roundNumber(clientAmount, CLIENT_AMOUNT_DP), true);
    }

    return false;
  }

  // #2
  if (values.bankRate && values.clientRate) {
    const markupRate = values.bankRate - values.clientRate;
    if (!touched.markupRate) {
      setFieldValue("markupRate", roundNumber(markupRate, MARKUP_RATE_DP), true);
    }

    if (!touched.markupAmount) {
      const markupAmount = Number(values.fromAmount) * markupRate;
      setFieldValue("markupAmount", roundNumber(markupAmount, MARKUP_AMOUNT_DP), true);
    }

    if (!touched.bankAmount) {
      const bankAmount = Number(values.fromAmount) * values.bankRate;
      setFieldValue("bankAmount", roundNumber(bankAmount, BANK_AMOUNT_DP), true);
    }

    if (!touched.clientAmount) {
      const clientAmount = Number(values.fromAmount) * values.clientRate;
      setFieldValue("clientAmount", roundNumber(clientAmount, CLIENT_AMOUNT_DP), true);
    }

    return false;
  }

  // #3
  if (values.bankRate && values.markupAmount) {
    const bankAmount = Number(values.fromAmount) * values.bankRate;
    if (!touched.bankAmount) {
      setFieldValue("bankAmount", roundNumber(bankAmount, BANK_AMOUNT_DP), true);
    }

    const markupRate = values.markupAmount / values.fromAmount;
    if (!touched.markupRate) {
      setFieldValue("markupRate", roundNumber(markupRate, MARKUP_RATE_DP), true);
    }

    const clientRate = values.bankRate - markupRate;
    if (!touched.clientRate) {
      setFieldValue("clientRate", roundNumber(clientRate, CLIENT_RATE_DP), true);
    }

    if (!touched.clientAmount) {
      const clientAmount = Number(values.fromAmount) * clientRate;
      setFieldValue("clientAmount", roundNumber(clientAmount, CLIENT_AMOUNT_DP), true);
    }

    return false;
  }

  // #4
  if (values.bankRate && values.bankAmount) {
    toast.error(incompleteText, 1000);
    return false;
  }

  // #5
  if (values.bankRate && values.clientAmount) {
    const clientRate = values.clientAmount / values.fromAmount;
    if (!touched.clientRate) {
      setFieldValue("clientRate", roundNumber(clientRate, CLIENT_RATE_DP), true);
    }

    const markupRate = values.bankRate - clientRate;
    if (!touched.markupRate) {
      setFieldValue("markupRate", roundNumber(markupRate, MARKUP_RATE_DP), true);
    }

    if (!touched.markupAmount) {
      const markupAmount = Number(values.fromAmount) * markupRate;
      setFieldValue("markupAmount", roundNumber(markupAmount, MARKUP_AMOUNT_DP), true);
    }

    const bankAmount = Number(values.fromAmount) * values.bankRate;
    if (!touched.bankAmount) {
      setFieldValue("bankAmount", roundNumber(bankAmount, BANK_AMOUNT_DP), true);
    }

    return false;
  }

  // This is needed incase some user inputs is cleared (touched) and calculate is pressed
  // Bank Rate
  if (!values.bankRate) {
    let { bankRate } = values;
    if (values.bankAmount) {
      bankRate = values.bankAmount / values.fromAmount;
    }

    if (values.clientRate && values.markupRate) {
      bankRate = values.markupRate + values.clientRate;
    }

    setFieldValue("bankRate", roundNumber(bankRate, BANK_RATE_DP), true);
    return false;
  }

  // Markup Rate
  if (!values.markupRate) {
    let { markupRate } = values;
    if (values.markupAmount) {
      markupRate = values.markupAmount / values.fromAmount;
    }

    if (values.clientRate) {
      markupRate = values.bankRate - values.clientRate;
    }

    setFieldValue("markupRate", roundNumber(markupRate, MARKUP_RATE_DP), true);
    return false;
  }

  // Client Rate
  if (!values.clientRate) {
    let { clientRate } = values;
    if (values.clientAmount) {
      clientRate = values.clientAmount / values.fromAmount;
    }

    if (values.markupRate) {
      clientRate = values.bankRate - values.markupRate;
    }

    setFieldValue("clientRate", roundNumber(clientRate, CLIENT_RATE_DP), true);
    return false;
  }

  // Markup Amount
  if (!values.markupAmount) {
    let { markupAmount } = values;
    if (values.markupRate) {
      markupAmount = values.fromAmount * values.markupRate;
    }

    if (values.bankAmount && values.clientAmount) {
      markupAmount = values.bankAmount - values.clientAmount;
    }

    setFieldValue("markupAmount", roundNumber(markupAmount, MARKUP_AMOUNT_DP), true);
    return false;
  }

  // Client Amount
  if (!values.clientAmount) {
    let { clientAmount } = values;
    if (values.clientRate) {
      clientAmount = values.fromAmount * values.clientRate;
    }

    if (values.bankAmount && values.markupAmount) {
      clientAmount = values.bankAmount - values.markupAmount;
    }

    setFieldValue("clientAmount", roundNumber(clientAmount, CLIENT_AMOUNT_DP), true);
    return false;
  }

  // Bank Amount
  if (!values.bankAmount) {
    let { bankAmount } = values;
    if (values.bankRate) {
      bankAmount = values.fromAmount * values.bankRate;
    }

    if (values.clientAmount && values.markupAmount) {
      bankAmount = values.clientAmount + values.markupAmount;
    }

    setFieldValue("bankAmount", roundNumber(bankAmount, BANK_AMOUNT_DP), true);
    return false;
  }

  if (
    values.bankRate &&
    values.markupRate &&
    values.clientRate &&
    values.bankAmount &&
    values.markupAmount &&
    values.clientAmount
  ) {
    return false;
  }

  toast.error(incompleteText, 1000);
  return false;
};

export default { runFxCalculations };
