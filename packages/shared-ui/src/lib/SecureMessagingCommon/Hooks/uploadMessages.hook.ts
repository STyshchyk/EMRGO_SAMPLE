import React from "react";

import { getFileUploadLink } from "@emrgo-frontend/services";
import { BytesFormmater, BytesToMb } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "../../Toast";

const fileErrors = {
  fileSize: "File size can not exceed 50MiB",
  fileAmount: "You can not upload more than 10 files at once",
};

export const useUploadMessages = (): [
  (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    uploadedFiles: any,
    fieldName: string
  ) => void,
  (
    index: number,
    attachments: any,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    fieldName: string
  ) => void,
  boolean
] => {
  const { mutate: doUploadFile, isLoading: isFileUploading } = useMutation(getFileUploadLink);
  // const [isFileUploading, setFileLoading] = useState(false);
  const { showWarningToast } = useToast();
  const handleFileDelete = (
    index: number,
    attachments: any,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    fieldName: string
  ) => {
    const temp = [...attachments];
    temp.splice(index, 1);
    setFieldValue(fieldName, temp);
  };
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    uploadedFiles: any,
    fieldName: string
  ) => {
    const file = event.target.files && event.target.files[0];
    const allFiles = [...(uploadedFiles ?? [])];
    if (!file) return;
    const formData = new FormData();
    formData.append(`${file.name}`, file);
    const files =
      [...event.target.files].map((element) => {
        return { fileName: file.name, size: BytesFormmater(file.size), url: "", isLoading: true };
      }) || [];
    const combinedFiles = [].concat(allFiles, files);
    if (BytesToMb(file.size) > 50) {
      showWarningToast(fileErrors.fileSize);
      return;
    }
    if (combinedFiles.length > 10) {
      showWarningToast(fileErrors.fileAmount);
      return;
    }
    setFieldValue(fieldName, combinedFiles);
    // setFileLoading(true);
    // setTimeout(() => {
    //   const array: any[] = combinedFiles;
    //   const fileIndex =
    //     Array.isArray(array) && array.findLastIndex((elem) => elem.fileName === file.name);
    //   array[fileIndex].isLoading = false;
    //   array[fileIndex].url = "TestPath";
    //   setFileLoading(false);
    //   setFieldValue(fieldName, array);
    // }, 5000);
    doUploadFile(
      { filename: `${file.name}`, formData },
      {
        onSuccess: (res) => {
          const array: any[] = combinedFiles;
          const fileIndex =
            Array.isArray(array) && array.findLastIndex((elem) => elem.fileName === file.name);
          array[fileIndex].isLoading = false;
          array[fileIndex].url = res.path;
          setFieldValue(fieldName, array);
        },
        onError: (error) => {
          console.log("error", error);
        },
      }
    );
  };

  return [handleFileChange, handleFileDelete, isFileUploading] as const;
};
