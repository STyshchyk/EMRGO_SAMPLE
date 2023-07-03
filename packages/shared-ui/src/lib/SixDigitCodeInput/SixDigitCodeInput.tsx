import { FC } from "react";
import OtpInput from "react-otp-input";

import * as Styles from "./SixDigitCodeInput.styles";
import { ISixDigitCodeInputProps } from "./SixDigitCodeInput.types";

export const SixDigitCodeInput: FC<ISixDigitCodeInputProps> = ({
  onChange,
  value,
  size = "medium",
  variant = "default",
}) => {
  return (
    <Styles.SixDigitCodeInput>
      <Styles.InputWrapper>
        <OtpInput
          shouldAutoFocus
          value={value}
          onChange={onChange}
          numInputs={6}
          containerStyle={{ gap: "1rem" }}
          renderInput={(props) => (
            <Styles.Input
              {...props}
              $error={false}
              $success={false}
              $size={size}
              $variant={variant}
            />
          )}
        />
      </Styles.InputWrapper>
    </Styles.SixDigitCodeInput>
  );
};
