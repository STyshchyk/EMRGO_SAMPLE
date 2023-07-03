import { render } from "@testing-library/react";

import { DataRoomDocumentCount } from "./DataRoomDocumentCount";

test("DataRoomDocumentCount", () => {
  render(<DataRoomDocumentCount numberOfDocuments={1} />);
});
