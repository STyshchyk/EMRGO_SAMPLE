import { Button, FormikInputCustom } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { Field, Form, Formik } from "formik";

import { useEntityManagementContext } from "../EntityManagement.provider";
import { INewUser } from "../EntityManagement.types";
import { onboardUserSchema } from "./OnboardUser.schema";
import * as Styles from "./OnboardUser.styles";
import { TwoCol } from "./OnboardUser.styles";

const initialValues: INewUser = {
  firstName: "",
  lastName: "",
  email: "",
  roles: null,
};

export const OnboardUserComponent = () => {
  const { handleSubmit, rolesList } = ensureNotNull(useEntityManagementContext());

  return (
    <Styles.OnboardUser>
      <Formik
        initialValues={initialValues}
        validationSchema={onboardUserSchema}
        onSubmit={(values, formikHelpers) => {
          handleSubmit(values);
          formikHelpers.setSubmitting(false);
        }}
      >
        {({ values, setFieldValue }) => (
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
                  setFieldValue("roles", selected);
                }}
                options={rolesList}
                placeholder="Select role"
              />
            </TwoCol>
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </Styles.OnboardUser>
  );
};
