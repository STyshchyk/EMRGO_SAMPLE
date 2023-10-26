export const getAttribute = (attrs, fieldName) => {
    const attribute = attrs?.filter((attr) => attr?.match.key === fieldName)[0];
    return attribute?.value;
  };