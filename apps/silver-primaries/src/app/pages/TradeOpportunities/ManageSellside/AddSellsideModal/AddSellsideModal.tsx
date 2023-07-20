import React, { FC, useState } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { postSellside } from "@emrgo-frontend/services";
import { FormikInput, FormikInputCustom, useToast } from "@emrgo-frontend/shared-ui";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

// TODO: MOVE THIS TO CONSTANTS
import { convertToBase64, formatBytes, MAX_FILE_SIZE } from "../../../../utils";
import { useAddSellsideStore } from "../../../store";
import { SellSideSchema } from "./AddSellSideModal.schema";
import * as Styles from "./AddSellsideModal.styles";
import { IAddSellsideModalProps } from "./AddSellsideModal.types";

const initialValues: {
  name: string;
  logo: File | null;
} = {
  name: "",
  logo: null,
};
export const AddSellsideModal: FC<IAddSellsideModalProps> = () => {
  const { mutate: doPostSellside } = useMutation(postSellside);
  const { isModalOpen, modalActions } = useAddSellsideStore();
  const [file, setFile] = useState<File>();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  return (
    <Styles.AddSellsideModal>
      <Styles.SellSideWrapper>
        <Formik
          initialValues={initialValues}
          validationSchema={SellSideSchema}
          onSubmit={async (values, formikHelpers) => {
            const base64: any = await convertToBase64(values.logo);
            if (values.logo && values.logo.size > MAX_FILE_SIZE) {
              formikHelpers.setFieldError(
                "logo",
                `File is too large ${formatBytes(values.logo.size, 1)},
                max size is ${formatBytes(MAX_FILE_SIZE, 1)}          `
              );
              return;
            }
            if (values.logo !== undefined) {
              doPostSellside(
                { name: values.name, logo: base64 },
                {
                  onSuccess: () => {
                    queryClient
                      .invalidateQueries({
                        queryKey: [queryKeys.primaries.tradeOpportunities.sellSide.fetch],
                      })
                      .then((r) => {});
                    showSuccessToast("Succesfully added new Sellside");
                    modalActions.setModalOpen(false);
                  },
                  onError: () => {
                    showErrorToast("Error while adding Sellside");
                  },
                }
              );
              alert(JSON.stringify(values, null, 2));
              formikHelpers.setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, setFieldError }) => (
            <Form className={"invite-user"}>
              <Styles.TwoCol>
                <label>Entity Name</label>
                <Field
                  id="name"
                  name="name"
                  as={"text"}
                  label={"Entity Name"}
                  component={FormikInput}
                />
              </Styles.TwoCol>
              <Styles.TwoCol>
                <label>Upload Logo</label>
                <div>
                  <Field
                    accept=".png"
                    type={"file"}
                    onChange={async (event: any) => {
                      if (event.target.files !== null) {
                        setFile(event.target.files[0]);
                        setFieldValue("logo", event.target.files[0]);
                      }
                    }}
                    component={FormikInputCustom}
                    label={"Select file"}
                    id={"logo"}
                    name={"logo"}
                  />
                </div>
              </Styles.TwoCol>

              <div style={{ display: "flex", marginTop: "25px" }}>
                <Styles.Spacer />
                <Button
                  variant="contained"
                  type={"submit"}
                  style={{ backgroundColor: "#18686D", color: "white" }}
                >
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Styles.SellSideWrapper>
    </Styles.AddSellsideModal>
  );
};
