export const changeDefaultEntityType = (entityType) => {
  let updatedEntityType = entityType;
  switch (entityType) {
    case "invst_mngr":
      updatedEntityType = "INVESTOR";
      break;
    default:
      break;
  }

  return updatedEntityType;
};
