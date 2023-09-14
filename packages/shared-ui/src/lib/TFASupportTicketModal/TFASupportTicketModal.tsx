import { FC, useRef } from "react";

import { supportTypes } from "@emrgo-frontend/constants";
import { createSupportTicket, getFileUploadLink } from "@emrgo-frontend/services";
import {
  Button,
  FormikInputCustom,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  OneCol,
  Spacer,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { ITFASupportTicketModalProps } from "./TFASupportTicketModal.types";
import { TFASupportTicketModalFormSchema } from "./TFASupportTikcetModal.schema";

export const TFASupportTicketModal: FC<ITFASupportTicketModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const fileInputRef = useRef(null);
  const { mutate: doUploadFile } = useMutation(getFileUploadLink);
  const { mutate: doCreateSupportTicket } = useMutation(createSupportTicket);
  const { showErrorToast, showSuccessToast } = useToast();

  return (
    <Modal isOpen={isOpen} width={"25%"}>
      <Formik
        initialValues={{
          type: supportTypes.TFA_SUPPORT_TICKET,
          email: email || "",
          file: null,
        }}
        validationSchema={TFASupportTicketModalFormSchema}
        onSubmit={(values, formikHelpers) => {
          const requestPayload = {
            ...values,
            file: values.file ? values.file?.path : "",
          };

          doCreateSupportTicket(requestPayload, {
            onSuccess: (response) => {
              console.log("🚀 ~ file: TFASupportTicketModal.tsx:52 ~ response:", response);
            },
          });

          formikHelpers.setSubmitting(false);
        }}
      >
        {({ handleSubmit, setFieldValue }) => {
          const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            const formData: any = new FormData();
            formData.append("file", file);
            doUploadFile(
              { filename: file.name, formData },
              {
                onSuccess: (res) => {
                  setFieldValue("file", { name: file.name, path: res.path });
                  // doUpdateDocument({ id, name, path: res.path });
                },
                onError: () => {
                  showErrorToast("Error while creating/posting file to oracle");
                },
              }
            );
            // @ts-ignore
            event.target.value = null;
          };

          return (
            <Form>
              <ModalHeader onClose={onClose}>
                <ModalTitle>Raise Support Ticket</ModalTitle>
                <ModalSubtitle>
                  Do you want to raise a ticket to Emrgo support to reset your 2 Factor
                  Authentication credentials. Only do this when you have lost access to your
                  authenticator app. Our team will use the file you upload to verify your account
                </ModalSubtitle>
              </ModalHeader>
              <ModalContent>
                <OneCol>
                  <Field
                    id="email"
                    name="email"
                    type={"email"}
                    label={"Enter Email ID"}
                    component={FormikInputCustom}
                  />
                </OneCol>
                <OneCol>
                  <Field
                    id="file"
                    name="file"
                    type={"file"}
                    label={"ID Proof"}
                    component={FormikInputCustom}
                    onChange={handleFileChange}
                  />
                </OneCol>
              </ModalContent>
              <ModalFooter>
                <Spacer />
                <Button type="submit" onClick={() => handleSubmit()}>
                  Submit Ticket
                </Button>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
