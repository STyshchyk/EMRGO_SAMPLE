import React, { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { postOpportunityDocument, postSellside } from "@emrgo-frontend/services";
import {
  Button,
  FormikInput,
  FormikInputCustom,
  MySelect,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { getFileUploadLink } from "../../../services/FileManager/FileManager";
import { useAddDocumentsModal } from "../../store/store";
import { addDocumentSchema } from "./AddDocument.schema";
import * as Styles from "./AddDocument.styles";
import { IAddDocumentProps } from "./AddDocument.types";

const stages = [
  { label: "Open", value: true },
  { label: "Client Questionnaire", value: false },
];
export const AddDocument: FC<IAddDocumentProps> = ({}) => {
  const { id } = useParams();
  const { mutate: doPostSellside } = useMutation(postSellside);
  const { isModalOpen, modalActions } = useAddDocumentsModal();
  const [file, setFile] = useState<File>();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: doUploadFile, isLoading } = useMutation(getFileUploadLink, {
    onError: () => {
      showErrorToast("Error while posting file to oracle");
    },
  });

  const { mutate: doPostOpportunityDocument } = useMutation(postOpportunityDocument, {
    onSuccess: () => {
      queryClient
        .invalidateQueries([queryKeys.primaries.tradeOpportunities.documents, id])
        .then(() => {});
      modalActions.setModalOpen(false);
    },
    onError: () => {
      showErrorToast("Error while posting opportunity document");
    },
  });
  return (
    <Styles.AddDocument>
      <Formik
        initialValues={{
          docTitle: "",
          stage: stages[0],
          file: null,
        }}
        validateOnMount={true}
        validationSchema={addDocumentSchema}
        onSubmit={async (values, formikHelpers) => {
          // TODO : COMPLETE FILE UPLOAD FOR OPPORTUNITY
          const formData: any = new FormData();
          formData.append("file", file);
          doUploadFile(
            { filename: "KYC", formData },
            {
              onSuccess: async (res) => {
                doPostOpportunityDocument({
                  id: id ?? "",
                  path: res.path,
                  name: values.docTitle,
                  isPublic: values.stage.value,
                });
              },
            }
          );
          // alert(JSON.stringify(values, null, 2));
          formikHelpers.setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, errors, touched, isValid }) => (
          <Form>
            <Styles.TwoCol>
              <label>Document Title</label>
              <Field
                id="docTitle"
                value={values.docTitle}
                name="docTitle"
                as={"text"}
                label={"Title"}
                component={FormikInput}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label>Stage</label>
              <Field
                id="stage"
                name="stage"
                value={values.stage}
                as={"text"}
                options={stages}
                menuPlacement={"top"}
                placeholder={"Select Stage"}
                onChange={(selected: any) => {
                  setFieldValue("stage", selected);
                }}
                component={MySelect}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label>Upload</label>
              <div>
                <Field
                  id={"file"}
                  name={"file"}
                  accept=".pdf"
                  type={"file"}
                  onChange={async (event: any) => {
                    if (event.target.files !== null) {
                      setFile(event.target.files[0]);
                      setFieldValue("file", event.target.files[0]);
                    }
                  }}
                  component={FormikInputCustom}
                  label={"Select file"}
                />
              </div>
            </Styles.TwoCol>

            <div style={{ display: "flex", marginTop: "25px" }}>
              <Styles.Spacer />
              <Button type={"submit"} disabled={!isValid || isLoading}>
                Add
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Styles.AddDocument>
  );
};
