export const getAttribute = (attrs, fieldName) => {
    const attribute = attrs?.filter((attr) => attr?.match.name?.toLowerCase() === fieldName)[0];
    return attribute?.value;
  };