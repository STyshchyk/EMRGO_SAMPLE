import React, { useState } from "react";

import { getFileUploadLink } from "@emrgo-frontend/services";
import { useMutation } from "@tanstack/react-query";

export const useUploadMessages = (): [
  (event: React.ChangeEvent<HTMLInputElement>) => any,
  (index: number) => void,
  File | [],
  string[] | null
] => {
  const { mutate: doUploadFile } = useMutation(getFileUploadLink);
  const [currentFile, setCurrentFile] = useState<File | []>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[] | null>([]);

  const handleFileDelete = (index: number) => {
    const temp = [...currentFile];
    temp.splice(index, 1);
    setCurrentFile(temp);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const formData: any = new FormData();
    formData.append(file.name, file);
    const files =
      [...event.target.files].map((element) => {
        return { file: element, isLoading: true };
      }) || [];
    setCurrentFile((prevState) => [...prevState, ...files]);
    // doUploadFile(
    //   { filename: `${file.name}`, formData },
    //   {
    //     onSuccess: (res) => {
    // setCurrentFile((prevState) => {
    //   const array: any[] = [...prevState];
    //   const fileIndex =
    //     Array.isArray(array) && array.findLastIndex((elem) => elem.file.name === file.name);
    //   console.log(fileIndex);
    //   array[fileIndex].isLoading = false;
    //   return array;
    // });
    //
    //       const currentFile = { path: res.path, name: file.name };
    //       const uploadedFilesTotal = [...uploadedFiles, currentFile];
    //       setUploadedFiles(uploadedFilesTotal);
    //     },
    //     onError: (error) => {
    //       console.log("error", error);
    //     },
    //   }
    // );
  };

  return [handleFileChange, handleFileDelete, currentFile, uploadedFiles] as const;
};
