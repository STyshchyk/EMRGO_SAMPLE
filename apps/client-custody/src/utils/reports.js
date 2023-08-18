const formatAddress = (addresses) => {
  const operatingAddress = addresses.find((address) => address.type === "operating");
  let address = "";
  if (operatingAddress) {
    const {
      buildingNumber = "",
      addressLine1 = "",
      addressLine2 = "",
      city = "",
      country = "",
      pinCode = "",
    } = operatingAddress;
    address = `${buildingNumber ? `${buildingNumber},` : ""} ${
      addressLine1 ? `${addressLine1},` : ""
    } ${addressLine2 ? `${addressLine2},` : ""}  ${city ? `${city},` : ""} ${
      country ? `${country?.name},` : ""
    }   ${pinCode ? `${pinCode}` : ""}`;
  }

  return address;
};

export default formatAddress;
