import React, { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {  Button,FormikInputCustom, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { useAddIssuerStore } from "../../../store/store";
import { postIssuer, updateIssuer } from "../Issuer.services";
import { IIssuer } from "../ManageIssuers.types";
import { AddIssuersModalSchema } from "./AddIssuersModal.schema";
import * as Styles from "./AddIssuersModal.styles";
import { IAddIssuersModalProps } from "./AddIssuersModal.types";

const initialValues: IIssuer = {
  description: "",
  name: "",
  jurisdiction: "",
  industry: ""
};


export const AddIssuersModal: FC<IAddIssuersModalProps> = () => {
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useToast();

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
              <label htmlFor={"industry"}>Industry</label>
              <Field
                id={"industry"}
                name={"industry"}
                label={"Industry"}
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
                type={"textarea"}
                rows={10}
                cols={42}
                maxWidth={494}
                maxHeight={200}
                component={FormikInputCustom}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <Button disabled={!isValid} type={"submit"}>
                {modifyData ? "Modify" : "Add"}
              </Button>
            </Styles.TwoCol>
          </Form>
        )}
      </Formik>
    </Styles.AddIssuersModal>
  );
};

