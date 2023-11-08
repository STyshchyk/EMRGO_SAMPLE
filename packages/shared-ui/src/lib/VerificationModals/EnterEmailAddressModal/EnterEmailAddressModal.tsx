import { FC,useState} from "react";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  SixDigitCodeInput,
  useToast
} from "@emrgo-frontend/shared-ui";
import { useFormik } from "formik";
import { useUser } from "@emrgo-frontend/shared-ui";

import { EnterEmailAddressModalSchema } from "./EnterEmailAddressModal.schema";
import {
  IEnterEmailAddressFormProps,
  IEnterEmailAddressModalProps,
} from "./EnterEmailAddressModal.types";

export const EnterEmailAddressModal: FC<IEnterEmailAddressModalProps> = ({
  isOpen,
  onClose,
  onResetPassword,
}) => {
  const {user} = useUser();
  const { showSuccessToast } = useToast();
  const [activeStep, setActiveStep] = useState(0)

  const handleClose = () => {
    setActiveStep(0)
    onClose()
  }
  
  const form = useFormik<IEnterEmailAddressFormProps>({
    initialValues: {
      email: user?.email || "",
      code:"",
      verificationType:"authenticator"
    },
    validateOnMount: true,
    validationSchema: EnterEmailAddressModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      onResetPassword(values);
      setSubmitting(false);
      handleClose();
      showSuccessToast("We’ve sent a password reset link to your email");
    },
  });

  return (
    <Modal isOpen={isOpen} width={"33%"}>
      {activeStep === 0 && (
        <>
          <ModalHeader onClose={handleClose}>
            <ModalTitle>Reset your password</ModalTitle>
            <ModalSubtitle>
              To reset your password, enter your account’s verified email address.
            </ModalSubtitle>
          </ModalHeader>
          <ModalContent>
            <Input
              label="Email Address"
              autoFocus
              id="email"
              valid={form.touched.email && !form.errors.email}
              {...form.getFieldProps("email")}
              error={form.touched.email && form.errors.email}
            />
          </ModalContent>
          <ModalFooter>
            <Button
              size="large"
              onClick={() =>setActiveStep((prevActiveStep) => prevActiveStep + 1)}
              disabled={!!form.errors.email}
            >
              Next
            </Button>
          </ModalFooter>
        </>
      )
      }

      {activeStep === 1 && (
        <>
            <ModalHeader onClose={handleClose}>
              <ModalTitle>Reset your password</ModalTitle>
              <ModalSubtitle>
              Enter the 6-digit verification code from your authenticator app.
              </ModalSubtitle>
            </ModalHeader>

            <ModalContent>
              <SixDigitCodeInput
                value={form.values.code}
                onChange={(otp) => {
                form.setFieldValue("code", otp);
                }}
                variant="signup"
              />
            </ModalContent>
            <ModalFooter>
              <Button
                size="large"
                type="submit"
                onClick={() => form.handleSubmit()}
                disabled={!!form.errors.code || form.isSubmitting}
              >
                Submit
              </Button>
            </ModalFooter>
        </>
      )}
    </Modal>
  );
};
