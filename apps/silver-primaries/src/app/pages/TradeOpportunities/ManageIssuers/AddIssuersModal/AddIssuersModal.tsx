import React, { FC } from "react";

import { MyTextArea, useToast, FormikInputCustom, Button } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";




import { useAddIssuerStore } from "../../../store/store";
import { postIssuer, updateIssuer } from "../Issuer.services";
import { IIssuer } from "../ManageIssuers.types";
import { AddIssuersModalSchema } from "./AddIssuersModal.schema";
import * as Styles from "./AddIssuersModal.styles";
import { IAddIssuersModalProps } from "./AddIssuersModal.types";
import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";

const initialValues: IIssuer = {
  description: "",
  name: "",
  jurisdiction: ""
};


export const AddIssuersModal: FC<IAddIssuersModalProps> = () => {
  const queryClient = useQueryClient();
  const { modifyData } = useAddIssuerStore();
  const { mutate: doPostIssuer } = useMutation(postIssuer);
  const { mutate: doUpdateIssuer } = useMutation(updateIssuer);
  const { isModalOpen, modalActions } = useAddIssuerStore();
  return (
    <Styles.AddIssuersModal>
      <Formik
        initialValues={modifyData || initialValues}
        validationSchema={AddIssuersModalSchema}
        onSubmit={(values, formikHelpers) => {
          alert(JSON.stringify(values, null, 2));
          const { showErrorToast, showSuccessToast } = useToast();
          if (!modifyData) {
            doPostIssuer(values, {
              onSuccess: () => {
                showSuccessToast("Succesfully added Issuer");
                queryClient
                  .invalidateQueries({
                    queryKey: [queryKeys.primaries.tradeOpportunities.issuers.fetch]
                  })
                  .then((r) => {
                  });
                modalActions.setModalOpen(false);
              },
              onError: () => {
                showErrorToast("Error occured during adding Issuer");
              }
            });
          } else {
            doUpdateIssuer(values, {
              onSuccess: () => {
                showSuccessToast("Succesfully added Issuer");
                queryClient
                  .invalidateQueries({
                    queryKey: [queryKeys.primaries.tradeOpportunities.issuers.fetch]
                  })
                  .then((value) => {
                  });
                modalActions.setModalOpen(false);
              },
              onError: () => {
                showErrorToast("Error occured during adding Issuer");
              }
            });
          }
          formikHelpers.setSubmitting(false);
        }}
      >
        {({ values, errors, touched, isValid }) => (
          <Form>
            <Styles.TwoCol>
              <label htmlFor={"name"}>Entity Name</label>
              <Field
                id={"name"}
                name={"name"}
                label={"Issuer Name"}
                as={"input"}
                type={"text"}
                component={FormikInputCustom}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label htmlFor={"jurisdiction"}>Issuer Jurisdiction</label>
              <Field
                id={"jurisdiction"}
                name={"jurisdiction"}
                label={"Issuer Jurisdiction"}
                as={"input"}
                type={"text"}
                component={FormikInputCustom}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label htmlFor={"description"}>Issuer Description</label>

              <Field
                id={"description"}
                name={"description"}
                label={"Issuer Description"}
                as={"textarea"}
                rows={10}
                cols={42}
                maxWidth={494}
                errors={errors}
                touched={touched}
                component={MyTextArea}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              {/*TODO: FIX THIS BUTTON*/}
              <Button disabled={!isValid}>
                {modifyData ? "Modify" : "Add"}
              </Button>
            </Styles.TwoCol>
          </Form>
        )}
      </Formik>
    </Styles.AddIssuersModal>
  );
};

