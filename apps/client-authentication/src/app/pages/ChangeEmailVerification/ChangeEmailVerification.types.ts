export interface IChangeEmailVerificationProps {}

export interface IChangeEmailVerificationContext {
  isLoading: boolean;
  isError: boolean;
  error: Error | unknown;
  redirectToLogin: () => void;
}

export interface IChangeEmailVerificationFormProps {
  token: string;
}
