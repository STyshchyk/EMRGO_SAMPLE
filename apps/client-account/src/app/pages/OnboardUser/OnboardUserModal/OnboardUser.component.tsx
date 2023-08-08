import React from "react";

import { Button, FormikInputCustom, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { onboardUser } from "../EntityManagement.service";
import { INewUser } from "../EntityManagement.types";
import { onboardUserSchema } from "./OnboardUser.schema";
import * as Styles from "./OnboardUser.styles";
import { TwoCol } from "./OnboardUser.styles";
import { IOnboardedUser } from "./OnboardUser.types";

const initialValues: INewUser = {
  email: "hadid@emrgo.com",
  lastName: "Hadid",
  roles: [],
  // middleName: "",
  firstName: "Yolanda"
};

export const OnboardUserComponent = () => {
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
          // doPostUser(values);
          console.log(values)
          const roles = values.roles.map((role) => role.value )
          console.log(roles)

          const payload = {
            ...values,
            roles,
          }

          console.log(payload)
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
              <label htmlFor="lastName">Last name</label>
              <Field
                id="lastName"
                component={FormikInputCustom}
                name="lastName"
                type={"input"}
                label={"Enter Last Name"}
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
              <label htmlFor="roles">Select role</label>
              <Field
                name="roles"
                component={FormikInputCustom}
                type={"select"}
                hideSelectedOptions={false}
                isClearable={false}
                value={values.roles}
                id={"roles"}
                isMulti={true}
                onChange={(selected: any) => {
                  console.log('onchaneg',selected)
                  setFieldValue("roles",selected );
                }}
                options={[
                  { label: "Investor", value: "invst_mngr" },
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
