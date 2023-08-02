/* eslint-disable jsx-a11y/anchor-is-valid */
import { mdiBlockHelper } from "@mdi/js";

import ErrorBanner from "../ErrorBanner";

const ForbiddenErrorBanner = () => (
  <ErrorBanner
    title="Forbidden"
    description="You don't have permission to view this page. Please contact Emrgo Customer Support"
    icon={mdiBlockHelper}
  />
);

export default ForbiddenErrorBanner;
