import { FC } from "react";

import { Button, IDropdownItem, Modal } from "@emrgo-frontend/shared-ui";
import { DashboardContent } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { getInvitedUserStatusLabel, getInvitedUserTypeLabel } from "../helpers";
import { useInviteUserModal } from "../store";
import { InviteUser } from "./InviteUserModal";
import { UserRoles } from "./InviteUserModal/InviteUser.types";
import { InvitedUsers } from "./IvitedUsers";
import { useUserContext } from "./User.provider";
import * as Styles from "./User.styles";
import { IUserProps, TFilterStatus2, TFilterType2 } from "./User.types";

const filterTypes2: IDropdownItem<TFilterType2>[] = [
  { value: "all-types", label: "All types" },
  {
    value: UserRoles.operationsPlatformSolutions,
    label: getInvitedUserTypeLabel(UserRoles.operationsPlatformSolutions),
  },
  { value: UserRoles.finance, label: getInvitedUserTypeLabel(UserRoles.finance) },
  { value: UserRoles.compliance, label: getInvitedUserTypeLabel(UserRoles.compliance) },
  {
    value: UserRoles.relationshipManagerSales,
    label: getInvitedUserTypeLabel(UserRoles.relationshipManagerSales),
  },
];

const filterStatuses2: IDropdownItem<TFilterStatus2>[] = [
  { value: "all-statuses", label: "All statuses" },
  { value: "canceled", label: getInvitedUserStatusLabel("canceled") },
  { value: "invited", label: getInvitedUserStatusLabel("invited") },
  { value: "onboarded", label: getInvitedUserStatusLabel("onboarded") },
];

export const UserComponent: FC<IUserProps> = ({}: IUserProps) => {
  const {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    downloadData,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
  } = ensureNotNull(useUserContext());
  const { isModalOpen, modalActions } = useInviteUserModal();
  return (
    <DashboardContent>
      <Styles.Button>
        <Button onClick={() => modalActions.setModalOpen(true)}>Invite User</Button>
      </Styles.Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => modalActions.setModalOpen(false)}
        showCloseButton={true}
        title={"Invite user"}
      >
        <InviteUser />
      </Modal>
      <InvitedUsers />
    </DashboardContent>
  );
};
