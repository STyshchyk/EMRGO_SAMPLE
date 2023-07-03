import { render } from "@testing-library/react";

import { DataRoomDocument } from "./DataRoomDocument";

test("DataRoomDocument", () => {
  render(
    <DataRoomDocument
      document={{
        id: 1,
        name: "name",
      }}
    />
  );
});
