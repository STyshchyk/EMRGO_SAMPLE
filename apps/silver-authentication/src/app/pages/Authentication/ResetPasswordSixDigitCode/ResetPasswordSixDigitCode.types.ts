export interface IResetPasswordSixDigitCodeProps {
  method: "auth" | "text";
}

export interface IResetPasswordSixDigitCodeContext {
  onSubmit: () => void;
}
