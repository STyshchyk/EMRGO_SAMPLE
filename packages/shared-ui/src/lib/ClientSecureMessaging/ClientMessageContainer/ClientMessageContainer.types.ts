export interface IClientMessageContainerProps {
  isSendMode?: boolean;
  sendMode: TSendMode;
}
type TSendMode = "client" | "internal";
