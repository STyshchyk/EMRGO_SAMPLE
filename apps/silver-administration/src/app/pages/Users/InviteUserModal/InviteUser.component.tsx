import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { FormikInput, FormikInputCustom, IDropdownItem, useToast } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

import { TInvitedUserTypes } from "../../Administration.types";
import { useInviteUserModal } from "../../store";
import { inviteUser } from "../InviteUser.services";
import { TFilterType2 } from "../User.types";
import { inviteUserContext } from "./InviteUser.provider";
import * as Styles from "./InviteUser.styles";
import { IInviteUserProps, UserRoles } from "./InviteUser.types";

const filterTypes2: IDropdownItem<TFilterType2>[] = [
  {
    value: UserRoles.operationsPlatformSolutions,
    label: "Operations (Platform Solutions)",
  },
  {
    value: UserRoles.finance,
    label: "Finance",
  },
  {
    value: UserRoles.compliance,
    label: "Compliance",
  },
  {
    value: UserRoles.relationshipManagerSales,
    label: "Relationship Manager (Sales)",
  },
];
export const InviteUserComponent = ({}: IInviteUserProps) => {
  const { form, validationSchema } = ensureNotNull(inviteUserContext());
  const { mutate: doInviteUser } = useMutation(inviteUser);
  const { modalActions } = useInviteUserModal();
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  return (
    <Styles.InviteUser>
      <Formik
        initialValues={form.initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          // @ts-ignore
          const role = values.role.value;
          const payload = {
            ...values,
            role: role,
          };
          doInviteUser(payload, {
            onSuccess: (response) => {
              showSuccessToast("User invited");
              modalActions.setModalOpen(false);
              queryClient
                .invalidateQueries({ queryKey: [queryKeys.administration.users] })
                .then((r) => {
                  console.log("success", r);
                });
            },
            onError: () => {
              showErrorToast("Error occured during inviting new user");
            },
          });
          // alert(JSON.stringify(payload, null, 2));
          formikHelpers.setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, errors, setErrors, setFieldError }) => (
          <Form className={"invite-user"}>
            <Styles.TwoCol>
              <label htmlFor="firstName">First name</label>
              <Field
                id="firstName"
                name="firstName"
                component={FormikInput}
                as={"input"}
                label={"Enter First Name"}
                placeholder="Enter your name"
              />
            </Styles.TwoCol>

            <Styles.TwoCol>
              <label htmlFor="lastName">Second name</label>
              <Field
                id="lastName"
                component={FormikInput}
                name="lastName"
                as={"input"}
                label={"Enter Second Name"}
                placeholder="Enter your email"
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label htmlFor="email">Email ID</label>
              <Field
                id="email"
                name="email"
                as={"email"}
                label={"Enter Email ID"}
                component={FormikInput}
              />
            </Styles.TwoCol>
            <Styles.TwoCol>
              <label htmlFor="role">Select role</label>
              <Field
                name="role"
                component={FormikInputCustom}
                type={"select"}
                id={"role"}
                error={errors?.role ?? ""}
                onChange={(selected: TInvitedUserTypes) => {
                  setFieldValue("role", selected);
                  console.log(errors);
                }}
                options={filterTypes2}
                placeholder="Select role"
              />
            </Styles.TwoCol>
            <Styles.CustomButton margin={"0 0 0 auto"} type="submit">
              Submit
            </Styles.CustomButton>
          </Form>
        )}
      </Formik>
    </Styles.InviteUser>
  );
};
