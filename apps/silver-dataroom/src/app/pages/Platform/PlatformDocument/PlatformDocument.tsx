import React, { FC, useRef, useState } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { Button, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Heading, SubHeading } from "../../../components/Form";
import { getFileUploadLink } from "../../../services/FileManager/FileManager";
import { trimDate } from "../../../utils";
import { updateDocument } from "../../DataRoom.service";
import * as Styles from "./PlatformDocument.styles";
import { IPlatformDocumentProps } from "./PlatformDocument.types";

export const PlatformDocument: FC<IPlatformDocumentProps> = ({ lastUpdatedDate, type, id, path, version, name }) => {
  const [file, setFile] = useState<File>();
  const { showErrorToast, showSuccessToast } = useToast();
  const fileInputRef = useRef(null);
  const { mutate: doUploadFile } = useMutation(getFileUploadLink);
  const client = useQueryClient();
  const { mutate: doUpdateDocument } = useMutation(updateDocument, {
    onSuccess: () => {
      showSuccessToast("Succesfully updated documents");
      client.invalidateQueries([queryKeys.document.platform]).then(() => {
      });
    },
    onError: () => {
      showErrorToast("Error while trying to update documents");
    }
  });
  const handleButtonClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const formData: any = new FormData();
    formData.append("file", file);
    doUploadFile({ filename: `${name}.pdf`, formData }, {
      onSuccess: (res) => {
        doUpdateDocument({ id, name, path: res.path });
      },
      onError: () => {
        showErrorToast("Error while creating/posting file to oracle");
      }
    });
    // @ts-ignore
    event.target.value = null;
  };
  return (
    <Styles.PlatformTerms>
      <Heading>{name}</Heading>
      <input
        type="file"
        accept={"application/pdf"}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <SubHeading>Last Updated: {trimDate(lastUpdatedDate)} | v{version}</SubHeading>
      <Button variant={"secondary"} onClick={() => {
        handleButtonClick();
      }}>
        Upload
      </Button>
      <Button variant={"secondary"} disabled={true}>Notify Users</Button>
    </Styles.PlatformTerms>
  );
};
