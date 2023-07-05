import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Modal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useUserStore } from "../../pages/Authentication/store";
import { useMFAModal } from "../../pages/Primaries/store/store";
// import store from "store";
import { ClientTermsModal } from "../ClientTermsModal";
import { TwoFAstepper } from "../TwoFAstepper";
import { MFATYPE } from "../TwoFAstepper/TwoFAstepper.types";
import { DashboardSidebar } from "./DashboardSidebar";
import { useDashboardWrapperContext } from "./DashboardWrapper.provider";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

// const refreshAuthLogic = async () => {
//   try {
//     await refreshToken();
//     return Promise.resolve();
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };
// createAuthRefreshInterceptor(dashboardApi, refreshAuthLogic, {
//   pauseInstanceWhileRefreshing: true,
//   shouldRefresh(error): boolean {
//     // TODO: check validity codes
//     // @ts-ignore
//
//     const message = error?.response?.data?.message ?? "";
//     // @ts-ignore
//     const msgCode = error?.response?.data?.messageCode ?? "";
//     console.log(message);
//     // Check res msg if it's missing Cookie either expired access token, then Delete user from Local Storate if such exists
//     if (
//       message === UNAUTHORIZED ||
//       message === MISS_AUTH_TOKEN ||
//       message === INVALID_ACCESS_TOKEN ||
//       message === MISS_AUTH_TOKEN ||
//       message === TOKEN_EXPIRED ||
//       message === MISSING_AUTH_TOKEN
//     ) {
//       useUserStore.getState().removeUser();
//     }
//     return error?.response?.status === 401 || error?.response?.status === 403;
//   },
// });
export const DashboardWrapperComponent: FC<
  IDashboardWrapperProps
> = ({}: IDashboardWrapperProps) => {
  const {
    showClientTermsModal,
    onAcceptTerms,
    onDownloadTerms,
    onPrintTerms,
    onShareTerms,
    onRejectTerms
  } = ensureNotNull(useDashboardWrapperContext());
  const { user } = useUserStore();
  const { isModalOpen } = useMFAModal();

  return (
    <Styles.Container>
      <DashboardSidebar />
      <Styles.Content>
        <Outlet />
      </Styles.Content>
      <ClientTermsModal
        isOpen={!isModalOpen && showClientTermsModal}
        onAccept={onAcceptTerms}
        onDownload={onDownloadTerms}
        onPrint={onPrintTerms}
        onShare={onShareTerms}
        onReject={onRejectTerms}
      />

      <Modal
        width={1920}
        isOpen={isModalOpen && user?.verifyMFA}
        onClose={() => {
          //Skip mfa after login even page is reloaded
        }}
      >
        <TwoFAstepper
          mode={user?.mfaEnabled ? MFATYPE.verify : MFATYPE.enable}
          secret={""}
          otpauth_url={""}
        />
      </Modal>
    </Styles.Container>
  );
};
