import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useIntersectionObserver } from "usehooks-ts";

import { useFilters } from "../../Context";
import { useUnreadMessagesIds } from "../Hooks";
import * as Styles from "./MessageContainer.styles";
import { IMessageContainerProps } from "./MessageContainer.types";
import { MessageContainerItem } from "./MessageContainerItem";

export const MessageContainer: FC<IMessageContainerProps> = ({
  messsageList,
  isLoading,
  Key,
  scrollDown,
}) => {
  const { id } = useParams();
  const { userType } = useFilters();
  const bottomRef = useRef<HTMLDivElement>(null);
  const unreadRef = useRef<HTMLDivElement>(null);
  const client = new QueryClient();
  const emptyMessageBox = Array.isArray(messsageList) && messsageList.length > 0;
  const { mutate: updateReadtMessages } = useMutation(SecureMessagesApi.usePostReadMessages, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {});
    },
  });
  const { data: ureadMessagesId } = useUnreadMessagesIds(id, userType, true);
  const entry = useIntersectionObserver(unreadRef, { freezeOnceVisible: false });
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (unreadRef.current)
      setTimeout(() => {
        unreadRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    else if (bottomRef.current)
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
  }, [unreadRef.current, bottomRef.current, id, scrollDown]);

  useEffect(() => {
    return () => {
      const payload = { groupId: id };
      console.log("exit message list", id, payload, ureadMessagesId);
      if (!payload || !ureadMessagesId) return;
      updateReadtMessages({
        wrapper: userType,
        payload,
      });
    };
  }, [messsageList, ureadMessagesId]);

  return (
    <Styles.MessageContainer>
      <Styles.MessagesBox $isEmpty={emptyMessageBox} key={Key}>
        {emptyMessageBox &&
          messsageList.map((elem, index) => {
            return (
              <MessageContainerItem elem={elem} index={index} key={elem.id} unreadRef={unreadRef} />
            );
          })}
      </Styles.MessagesBox>
      <div ref={bottomRef}></div>
    </Styles.MessageContainer>
  );
};

// import React, { FC, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
//
// import { DEFAULT_DATE_TIME_FORMAT_SM } from "@emrgo-frontend/utils";
// import Chip from "@mui/material/Chip";
// import Divider from "@mui/material/Divider";
// import moment from "moment";
// import { useIntersectionObserver } from "usehooks-ts";
//
// import { useFilters } from "../../Context";
// import { AttachedFile } from "../AttachedFile";
// import * as Styles from "./MessageContainer.styles";
// import { IMessageContainerProps } from "./MessageContainer.types";
//
// export const MessageContainer: FC<IMessageContainerProps> = ({ messsageList, isLoading, Key }) => {
//   const { id } = useParams();
//   const { userType } = useFilters();
//   const ref = useRef<HTMLDivElement | null>(null);
//   const entry = useIntersectionObserver(ref, {});
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const emptyMessageBox = Array.isArray(messsageList) && messsageList.length > 0;
//   const isVisible = !!entry?.isIntersecting;
//   console.log(entry);
//   useEffect(() => {
//     // bottomRef.current?.scrollIntoView({ behavior: "auto" });
//   }, [id]);
//   return (
//     <Styles.MessageContainer>
//       <Styles.MessagesBox $isEmpty={emptyMessageBox} key={Key}>
//         {emptyMessageBox &&
//           messsageList.map((elem, index) => {
//             const files = elem?.attachments ?? [];
//             const sender = elem?.sender;
//             const date = moment(elem.sentAt).format(DEFAULT_DATE_TIME_FORMAT_SM);
//             const isCurrentMsgBelongToSender = elem.sender.type === userType;
//             const isNewMessagesPoint = messsageList[index].isNewStarted;
//             return (
//               <React.Fragment key={elem.id}>
//                 {isNewMessagesPoint && (
//                   <Divider
//                     className={"pt-2"}
//                     textAlign={!isCurrentMsgBelongToSender ? "left" : "right"}
//                   >
//                     <Chip label="New" size="small" />
//                   </Divider>
//                 )}
//                 <Styles.MessageItem $isSender={!isCurrentMsgBelongToSender}>
//                   <Styles.MessageHeader>
//                     <span>
//                       {sender.firstName} {sender.lastName}
//                     </span>
//                     <span>{date}</span>
//                   </Styles.MessageHeader>
//                   <Styles.MessageContent>{elem?.message}</Styles.MessageContent>
//                   {Array.isArray(files) && files.length > 0 && (
//                     <Styles.MessageFilesContainer>
//                       {files.map((file, index) => {
//                         return (
//                           <AttachedFile
//                             key={index}
//                             variant={"outlined"}
//                             color={"default"}
//                             index={index}
//                             fileName={file?.fileName ?? "test_name.pdf"}
//                             isLoading={false}
//                             size={file?.size ?? "100KiB"}
//                           />
//                         );
//                       })}
//                     </Styles.MessageFilesContainer>
//                   )}
//                 </Styles.MessageItem>
//               </React.Fragment>
//             );
//           })}
//       </Styles.MessagesBox>
//       <div ref={ref} />
//       <div ref={bottomRef}>sad</div>
//       {isVisible && <span>hello visible object</span>}
//     </Styles.MessageContainer>
//   );
// };
