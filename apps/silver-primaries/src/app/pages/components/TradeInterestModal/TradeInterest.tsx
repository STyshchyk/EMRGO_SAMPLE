import React, { FC, useState } from "react";

import { silverQueryKeys } from "@emrgo-frontend/constants";
import { getEntities, getTradeInterests } from "@emrgo-frontend/services";
import { postTradeInterest } from "@emrgo-frontend/services";
import { Button, FormikInput, FormikInputCustom, useToast } from "@emrgo-frontend/shared-ui";
import { ITradeInterestPayload } from "@emrgo-frontend/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { reverse } from "named-urls";

import { SubHeading } from "../../../components/Form";
import { useTradeInterestModal } from "../../store";
import { tradeInterestSchema } from "./TradeInterest.schema";
import * as Styles from "./TradeInterest.styles";
import { ITradeInterestModal } from "./TradeInterest.types";


const initialValues: ITradeInterestPayload = {
  opportunityId: "",
  status: "assigned",
  detail: "",
  userId: ""
};
export const TradeInterest: FC<ITradeInterestModal> = () => {
  const [file, setFile] = useState<File>();
  const { showErrorToast, showSuccessToast } = useToast();
  const { modalActions } = useTradeInterestModal();
  const queryClient = useQueryClient();
  const { opportunityData } = useTradeInterestModal();
  const { modifyData } = useTradeInterestModal();

  const { data: entityData } = useQuery(
    {
      queryFn: getEntities,
      queryKey: [silverQueryKeys.onboarding.fetch],
      select: (data) => data.filter(entity => entity.entityKycStatus === 3 && entity.userKycStatus === 3)
    }
  );
  const { mutate: doPostTradeInterest } = useMutation(postTradeInterest);
  return (
    <Styles.AddSellsideModal>
      {!modifyData && <SubHeading>Notify the Execution Manager of an intended trade</SubHeading>}
      <Styles.SellSideWrapper>
        <Formik
          initialValues={{
            name: modifyData ? modifyData.name : opportunityData?.issuer.name ?? "N/A",
            buyside: modifyData ? modifyData.buyside : null,
            detail: modifyData ? modifyData.detail : ""
          }
          }
          validationSchema={tradeInterestSchema}
          onSubmit={async (values, formikHelpers) => {
            const payload: ITradeInterestPayload = {
              opportunityId: opportunityData?.id ?? "",
              userId: values.buyside.userId ?? "",
              detail: values.detail,
              status: "assigned"
            };
            doPostTradeInterest(payload, {
              onSuccess: () => {
                modalActions.setModalOpen(false);
                queryClient.invalidateQueries([reverse(silverQueryKeys.primaries.tradeOpportunities.tradeInterest.fetch, { tradeInterests: `${opportunityData?.id}` })]).then(() => {
                  console.log("success");
                });
                showSuccessToast("Successfully created trade interest");
              },
              onError: () => {
                showErrorToast("Error posting trade interest");
              }
            });
            // alert(JSON.stringify(payload, null, 2));
            // formikHelpers.setSubmitting(false);
          }
          }
        >
          {({ values, setFieldValue, errors, touched, setFieldError }) => (
            <Form className={"invite-user"}>
              <Styles.TwoCol>
                <label>Issuance Name</label>
                <Field
                  id="name"
                  name="name"
                  as={"text"}
                  maxWidth={291}
                  disabled={true}
                  label={"Entity Name"}
                  component={FormikInput}
                />
              </Styles.TwoCol>
              <Styles.TwoCol>
                <label>Buy Side</label>
                <Field
                  id={"buyside"}
                  name={"buyside"}
                  label={"Select buy side"}
                  value={values.buyside}
                  disabled={!modifyData}
                  maxWidth={291}
                  getOptionValue={(options: any) => options}
                  getOptionLabel={(options: any) => {
                    return `${options.firstName ?? ""} ${options.lastName ?? ""}`;
                  }}
                  options={entityData}
                  isDisabled={modifyData}
                  onChange={(value: any) => {
                    setFieldValue("buyside", value);
                  }}
                  type={"select"}
                  component={FormikInputCustom}
                />
              </Styles.TwoCol>
              <Styles.TwoCol>
                <label htmlFor={"detail"}>Intended Trade Details</label>
                <Field
                  id={"detail"}
                  name={"detail"}
                  disabled={modifyData}
                  label={"Insert Trade Details"}
                  rows={10}
                  cols={45}
                  maxWidth={500}
                  maxHeight={325}
                  type={"textarea"}
                  component={FormikInputCustom}
                />
              </Styles.TwoCol>

              <div style={{ display: "flex", marginTop: "25px" }}>
                <Styles.Spacer />
                <Button
                  type={"submit"}
                >
                  {modifyData ? "Close" : "Notify"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Styles.SellSideWrapper>
    </Styles.AddSellsideModal>
  );
};
