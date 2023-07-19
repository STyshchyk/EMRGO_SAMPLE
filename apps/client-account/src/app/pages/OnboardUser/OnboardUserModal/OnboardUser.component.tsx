import React from "react";
import { FormikInput, FormikInputCustom, useToast, Button } from "@emrgo-frontend/shared-ui";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { onboardUserSchema } from "./OnboardUser.schema";
import * as Styles from "./OnboardUser.styles";
import { IOnboardedUser } from "./OnboardUser.types";
import { TwoCol } from "./OnboardUser.styles";
import { INewUser } from "../InvitedUsersTable/IvitedUsersTable.types";

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
  return (
    <Styles.OnboardUser>
      <Formik
        initialValues={initialValues}
        validationSchema={onboardUserSchema}
        onSubmit={(values, formikHelpers) => {
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
                value={values.role}
                id={"role"}
                onChange={(selected: any) => {
                  setFieldValue("role", selected);
                }}
                options={[
                  { label: "role1", value: "role1" },
                  { label: "role2", value: "role2" },
                  { label: "role3", value: "role3" },
                  { label: "role4", value: "role4" }
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
