import { FC } from "react";
import OtpInput from "react-otp-input";

import * as Styles from "./SixDigitCodeInput.styles";
import { ISixDigitCodeInputProps } from "./SixDigitCodeInput.types";

export const SixDigitCodeInput: FC<ISixDigitCodeInputProps> = ({ onChange, value }) => {
  return (
    <OtpInput
      shouldAutoFocus
      value={value}
      onChange={onChange}
      numInputs={6}
      containerStyle={{ gap: "1rem" }}
      inputStyle={{ width: "3rem" }}
      renderInput={(props) => <Styles.Input {...props} />}
    />
  );
};
