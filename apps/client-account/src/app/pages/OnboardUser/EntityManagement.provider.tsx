import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import v from "voca";

import {
  archiveUser,
  cancelInvitation,
  getOnboardedUsers,
  getRoles,
  inviteUser,
  makeOrRevokeAdmin,
  resendInvite,
} from "./EntityManagement.service";
import { IEntityManagementContext, INewUser, UserRoles } from "./EntityManagement.types";
import { getNewUserTypeLabel } from "./helpers";

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
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isOnboardUserModalOpen, setIsOnboardUserModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState([]);

  const { mutate: doOnboardUser } = useMutation(inviteUser);
  const { mutate: doCancelInvitation } = useMutation(cancelInvitation);
  const { mutate: doArchiveUser } = useMutation(archiveUser);
  const { mutate: doResendInvite } = useMutation(resendInvite);
  const { mutate: doMakeOrRevokeAdmin } = useMutation(makeOrRevokeAdmin);

  const { data: roleData } = useQuery({
    staleTime: Infinity,
    queryFn: () => getRoles(),
    queryKey: [queryKeys.account.onboardedUsers.roles],
    onSuccess: (response) => {
      const roles = response.map((role: { name: string; key: string }) => {
        const roleName = v.camelCase(role.name);
        return {
          label: getNewUserTypeLabel(UserRoles[roleName as keyof typeof UserRoles]),
          value: role.key,
        };
      });
      setRolesList(roles);
    },
  });

  useEffect(() => {
    const roles =
      roleData &&
      roleData.map((role: { name: string; key: string }) => {
        const roleName = v.camelCase(role.name);
        return {
          label: getNewUserTypeLabel(UserRoles[roleName as keyof typeof UserRoles]),
          value: role.key,
        };
      });
    setRolesList(roles);
  }, []);

  const {
    data: onboardedUsers,
    isError,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.account.onboardedUsers.fetch],
    queryFn: () => getOnboardedUsers(),
    onError: () => {
      if (isError && isFetched) showErrorToast("Error while fetching invited users");
    },
  });

  const onArchiveUser = (id: string) => {
    console.log("Remove user");
    doArchiveUser(id, {
      onSuccess: () => {
        showSuccessToast("Archived User successfully");
        queryClient.invalidateQueries([queryKeys.account.onboardedUsers.fetch]);
      },
      onError: () => {
        showErrorToast("Error while trying to remove user");
      },
    });
  };

  const onCancelInvitation = (id: string) => {
    console.log("Cancel invite");
    doCancelInvitation(id, {
      onSuccess: () => {
        showSuccessToast("Cancelled Invitation successfully");
        queryClient.invalidateQueries([queryKeys.account.onboardedUsers.fetch]);
      },
      onError: () => {
        showErrorToast("Error canceling invitation");
      },
    });
  };

  const onResendInvitation = (id: string) => {
    console.log("Resend invite");
    doResendInvite(id, {
      onSuccess: () => {
        showSuccessToast("Resent invitation successfully");
        queryClient.invalidateQueries([queryKeys.account.onboardedUsers.fetch]);
      },
      onError: () => {
        showErrorToast("Error while trying to Resend Invite");
      },
    });
  };

  const onMakeAdmin = (id: string) => {
    const requestPayload = {
      id,
      isAdmin: true,
    };
    doMakeOrRevokeAdmin(requestPayload, {
      onSuccess: () => {
        showSuccessToast("Assigned Admin role successfully");
        queryClient.invalidateQueries([queryKeys.account.onboardedUsers.fetch]);
      },
      onError: () => {
        showErrorToast("Error making admin");
      },
    });
  };

  const onRevokeAdmin = (id: string) => {
    const requestPayload = {
      id,
      isAdmin: false,
    };
    doMakeOrRevokeAdmin(requestPayload, {
      onSuccess: () => {
        showSuccessToast("Unassigned Admin role successfully");
        queryClient.invalidateQueries([queryKeys.account.onboardedUsers.fetch]);
      },
      onError: () => {
        showErrorToast("Error revoking admin");
      },
    });
  };

  const handleSubmit = (values: INewUser) => {
    if (!values.roles) return;
    const roles = values.roles.map((role: any) => role.value);
    const requestPayload = {
      ...values,
      roles,
    };
    doOnboardUser(requestPayload, {
      onSuccess: () => {
        showSuccessToast("User invited");
        setIsOnboardUserModalOpen(false);
        queryClient.invalidateQueries({ queryKey: [queryKeys.account.onboardedUsers.fetch] });
      },
      onError: (err: any) => {
        // message from BE is in arabic using messageCode for now
        const { messageCode } = err.response.data;
        if (messageCode === "ERR_EmailAlreadyExists") {
          return showErrorToast("User with this email already exists");
        }
        showErrorToast("Error occured during inviting new user");
      },
    });
  };

  const onViewPlatformDetails = () => {
    console.log("go to platform details page");
  };

  const onViewBankingDetails = () => {
    console.log("go to Client Banking page");
  };

  const onViewCashAccounts = () => {
    console.log("go to Account Opening (Safekeeping & Cash) page");
  };

  const onViewAuthRepresentatives = () => {
    console.log("go to Authorised Representatives page");
  };

  const state: IEntityManagementContext = {
    isOnboardUserModalOpen,
    setIsOnboardUserModalOpen,
    onboardedUsers,
    rolesList,

    onViewPlatformDetails,
    onViewBankingDetails,
    onViewCashAccounts,
    onViewAuthRepresentatives,
    handleSubmit,
    onArchiveUser,
    onCancelInvitation,
    onResendInvitation,
    onMakeAdmin,
    onRevokeAdmin,
  };

  return (
    <EntityManagementContext.Provider value={state}>{children}</EntityManagementContext.Provider>
  );
};

export const useEntityManagementContext = () => useContext(EntityManagementContext);
