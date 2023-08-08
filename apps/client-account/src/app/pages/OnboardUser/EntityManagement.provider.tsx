import { createContext, PropsWithChildren, useContext, useState } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";

import { onboarderUsers } from "./Data/data";
import { getOnboardedUsers } from "./EntityManagement.service";
import { IEntityManagementContext, INewUser } from "./EntityManagement.types";
import { onboardUserSchema } from "./OnboardUserModal/OnboardUser.schema";



const EntityManagementContext = createContext<IEntityManagementContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the OnboardUser template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const EntityManagementProvider = ({ children }: PropsWithChildren) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const [isOnboardUserModalOpen, setIsOnboardUserModalOpen] = useState(false);


  // const { data: onboardedUsers } = useQuery({
  //   queryFn: getOnboardedUsers,
  //   // enabled: false,//remove this to make request
  //   queryKey: [queryKeys.account.onboardedUsers.fetch],
  //   onError: () => {
  //     showErrorToast("Error fetching users");
  //   },
  //   // placeholderData: onboarderUsers//remove this field after api is ready
  // });


  const { data: onboardedUsers, isError, isFetched } = useQuery(
    [queryKeys.account.onboardedUsers.fetch],
    getOnboardedUsers,
    {
      enabled: true,
      onError: () => {
        if (isError && isFetched) showErrorToast("Error while fetching invited users");
      },
    }
  );

  const onViewPlatformDetails = () => {
    console.log('go to platform details page')
  }

  const onViewBankingDetails = () => {
    console.log('go to Client Banking page')
  }

  const onViewCashAccounts = () => {
    console.log('go to Account Opening (Safekeeping & Cash) page')
  }

  const onViewAuthRepresentatives = () => {
    console.log('go to Authorised Representatives page')
  }

  const state: IEntityManagementContext = {
    isOnboardUserModalOpen,
    setIsOnboardUserModalOpen,
    onboardedUsers,

    onViewPlatformDetails,
    onViewBankingDetails,
    onViewCashAccounts,
    onViewAuthRepresentatives

  };


  return <EntityManagementContext.Provider value={state}>{children}</EntityManagementContext.Provider>;
};

export const useEntityManagementContext = () => useContext(EntityManagementContext);
