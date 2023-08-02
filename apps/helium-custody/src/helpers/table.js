export const getCsvData = (transformedData) => {
  const listOfColumnNames = [];
  const listOfRowValues = [];

  transformedData?.forEach((td) => {
    const rowsList = [];
    const columnsList = [];
    Object.entries(td)
      .filter(([, { hidden }]) => !hidden)
      .forEach(([, { label, value }]) => {
        rowsList.push(value);
        columnsList.push(label);
      });
    listOfRowValues.push(rowsList);
    listOfColumnNames.push(columnsList);
  });

  return { listOfColumnNames, listOfRowValues };
};

export const transformShownColumns = (managedColumns, filters) => {
  const result = managedColumns.map((col) => ({
    ...col,
    id: col.field,
    ...(filters[col.field] && { defaultFilter: filters[col.field]?.value.value }),
    ...(filters[col.field] && {
      customFilterAndSearch: (term, rowData) => term === rowData?.[col.field],
    }),
  }));

  // 0: {title: 'Counterparty ID', field: 'counterpartyId', filter[col.field]}
  // 1: {title: 'Short Name', field: 'shortName',''}
  // 2: {title: ' Long Name', field: 'longName'}
  // 3: {title: 'Status', field: 'status'}

  // {status: 'Active', entity: 'INVESTOR A'}

  return result;
};

export const getSSIHeaderColumn = (columns) => {
  const hashMap = new Map();

  columns?.map(({ field }) => hashMap.set(field, field));

  // Improve this with the rest
  // used on pdf
  const listOfHeaderColumnNames = columns?.map(({ field }, i) => {
    if (field === "deliveryOrReceiveAgentIdType") {
      if (hashMap.has("deliveryOrReceiveIdentifier")) {
        return { title: "DeliveryOrReceive Agent", exportConfig: { colSpan: true } };
      }
      return { title: "DeliveryOrReceive Agent" };
    }

    if (field === "deliveryOrReceiveIdentifier") {
      if (hashMap.has("deliveryOrReceiveAgentIdType")) {
        return null;
      }
      return { title: "DeliveryOrReceive Agent" };
    }

    if (field === "sellerOrBuyerIdType") {
      if (hashMap.has("sellerOrBuyerIdentifier")) {
        return { title: "SellerOrBuyer", exportConfig: { colSpan: true } };
      }

      return { title: "SellerOrBuyer" };
    }

    if (field === "sellerOrBuyerIdentifier") {
      if (hashMap.has("sellerOrBuyerIdType")) {
        return null;
      }

      return { title: "SellerOrBuyer" };
    }

    return { title: "" };
  });

  return listOfHeaderColumnNames;
};
