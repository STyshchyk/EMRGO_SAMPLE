export interface IMessagesContainerCommonProps {
  isSendMode?: boolean;
  sendMode: TSendMode;
}
type TSendMode = "client" | "internal";
