import { useSelector } from "react-redux";

import * as authSelectors from "../../../redux/selectors/auth";
import ClosingInitialize from "./ClosingInitialize";
import ClosingSignoff from "./ClosingSignoff";

const Closing = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const { entityType } = currentEntityGroup;

  if (entityType === "LEGAL_COUNSEL") {
    return <ClosingInitialize />;
  }

  return <ClosingSignoff />;
};

export default Closing;
