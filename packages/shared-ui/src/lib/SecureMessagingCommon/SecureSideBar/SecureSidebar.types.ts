import { TWriteType } from "@emrgo-frontend/shared-ui";

export interface ISidebarProps {
  type: "client" | "internal";
  messageList: any[];
  setNewMsgGroup: (flag: TWriteType) => void;
}
