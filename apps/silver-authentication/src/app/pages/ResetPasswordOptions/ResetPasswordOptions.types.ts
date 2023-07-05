export interface IResetPasswordOptionsProps {}

export interface IResetPasswordOptionsContext {
  isButtonEnabled: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
