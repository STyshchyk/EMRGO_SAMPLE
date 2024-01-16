import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { AttachedFile } from "../AttachedFile";
import * as Styles from "./MessageContainer.styles";
import { IMessageContainerProps } from "./MessageContainer.types";

export const MessageContainer: FC<IMessageContainerProps> = ({
  isSendMode = false,
  sendMode,
  messsageList = isSendMode ? [] : Array.from(Array(5).keys()),
}) => {
  const { id } = useParams();
  const bottomRef = useRef<HTMLDivElement>(null);
  const emptyMessageBox = Array.isArray(messsageList) && messsageList.length > 0;
  const files = [1, 2, 3];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id]);

  return (
    <Styles.MessageContainer>
      <Styles.MessagesBox isEmpty={emptyMessageBox}>
        {emptyMessageBox ? (
          messsageList.map((elem, index) => {
            return (
              <Styles.MessageItem $isSender={index % 2 === 1} key={index}>
                <Styles.MessageHeader>
                  <span>Instant Doe</span>
                  <span>15.56 12.12.24</span>
                </Styles.MessageHeader>
                <Styles.MessageContent>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium asperiores
                  at blanditiis delectus dicta facere fugiat itaque magnam maxime minima
                  necessitatibus non numquam obcaecati officia officiis perferendis porro
                  repudiandae, sequi, sit totam vel veritatis voluptatum! Dicta obcaecati sed
                  veniam? Assumenda aut consequatur culpa delectus doloremque dolores libero maxime
                  nam nemo quam qui quidem sapiente sequi, sit, veniam? Aperiam in ipsum officia.
                  Accusamus ad atque debitis delectus deserunt dicta dolor dolore doloremque ipsum
                  iure, magni numquam quas reiciendis rerum sed soluta vel. Autem cupiditate
                  deserunt ducimus enim, eos harum laborum mollitia odit praesentium provident quae
                  quasi qui reiciendis, soluta veniam!
                </Styles.MessageContent>
                {Array.isArray(files) && files.length > 0 && (
                  <Styles.MessageFilesContainer>
                    {files.map((file, index) => {
                      return <AttachedFile key={index} variant={"outlined"} />;
                    })}
                  </Styles.MessageFilesContainer>
                )}
              </Styles.MessageItem>
            );
          })
        ) : (
          <> Start New Query</>
        )}
      </Styles.MessagesBox>

      <div ref={bottomRef} />
    </Styles.MessageContainer>
  );
};
