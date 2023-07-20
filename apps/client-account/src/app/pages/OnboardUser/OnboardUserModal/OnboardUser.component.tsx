import React from "react";

import { Button, FormikInputCustom, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { INewUser } from "../InvitedUsersTable/IvitedUsersTable.types";
import { onboardUser } from "../OnboardUser.service";
import { onboardUserSchema } from "./OnboardUser.schema";
import * as Styles from "./OnboardUser.styles";
import { TwoCol } from "./OnboardUser.styles";
import { IOnboardedUser } from "./OnboardUser.types";

const initialValues: INewUser = {
  email: "",
  lastName: "",
  role: "",
  middleName: "",
  firstName: ""
};

export const OnboardUserComponent = ({}: IOnboardedUser) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: doPostUser } = useMutation({
    mutationFn: onboardUser,
    onError: () => {
      showErrorToast("Error while onboarding user");
    }
  });
  return (
    <Styles.OnboardUser>
      <Formik
        initialValues={initialValues}
        validationSchema={onboardUserSchema}
        onSubmit={(values, formikHelpers) => {
          doPostUser(values);
          alert(JSON.stringify(values, null, 2));
          formikHelpers.setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, errors, setErrors, setFieldError }) => (
          <Form>
            <TwoCol>
              <label htmlFor="firstName">First name</label>
              <Field
                id="firstName"
                name="firstName"
                component={FormikInputCustom}
                type={"input"}
                label={"Enter First Name"}
                placeholder="Enter your name"
              />
            </TwoCol>
            <TwoCol>
              <label htmlFor="middleName">Middle name</label>
              <Field
                id="middleName"
                component={FormikInputCustom}
                name="middleName"
                type={"input"}
                label={"Enter Second Name"}
                placeholder="Enter your email"
              />
            </TwoCol>
            <TwoCol>
              <label htmlFor="lastName">Second name</label>
              <Field
                id="lastName"
                component={FormikInputCustom}
                name="lastName"
                type={"input"}
                label={"Enter Second Name"}
                placeholder="Enter your email"
              />
            </TwoCol>
            <TwoCol>
              <label htmlFor="email">Email ID</label>
              <Field
                id="email"
                name="email"
                type={"email"}
                label={"Enter Email ID"}
                component={FormikInputCustom}
              />
            </TwoCol>
            <TwoCol>
              <label htmlFor="role">Select role</label>
              <Field
                name="role"
                component={FormikInputCustom}
                type={"select"}
                hideSelectedOptions={false}
                isClearable={false}
                value={values.role}
                id={"role"}
                isMulti={true}
                onChange={(selected: any) => {
                  setFieldValue("role", selected);
                }}
                options={[
                  { label: "Investor", value: "invst_mgr" },
                  { label: "Admin", value: "admin" }
                ]
                }
                placeholder="Select role"
              />
            </TwoCol>
            <Button type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Styles.OnboardUser>
  );
};
