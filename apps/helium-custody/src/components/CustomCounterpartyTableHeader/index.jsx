import { MTableHeader } from "@material-table/core";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import style from "./style.module.scss";

function setColSpan(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    const currentFieldType = arr[i].fieldType;
    const previousFieldType = arr[i - 1]?.fieldType;

    if (currentFieldType && currentFieldType !== previousFieldType) {
      result.push({ ...arr[i], colSpan: 1 });
    } else if (result.length && Object.keys(arr[i]).length !== 0) {
      result[result.length - 1].colSpan = 2;
    }
  }

  return result;
}

const CustomCounterpartyTableHeader = (props) => {
  const {
    columns,
    filterColumns: { shownColumns },
  } = props;

  const groupByTypes = {
    deliveryOrReceiveAgentIdType: "delivery",
    deliveryOrReceiveIdentifier: "delivery",
    sellerOrBuyerIdType: "seller",
    sellerOrBuyerIdentifier: "seller",
  };

  const headerTitles = {
    deliveryOrReceiveAgentIdType: "Delivery/Receive Agent",
    deliveryOrReceiveIdentifier: "Delivery/Receive Agent",
    sellerOrBuyerIdType: "Seller/Buyer",
    sellerOrBuyerIdentifier: "Seller/Buyer",
  };

  const orderOfColumns = [];

  shownColumns?.map(({ field }, index) => {
    if (groupByTypes[field]) {
      orderOfColumns.push({ position: index, fieldType: groupByTypes[field] });
    } else {
      orderOfColumns.push({});
    }
  });

  const formatedColumns = setColSpan(orderOfColumns);

  let skipTableCell = false;
  const contentView = shownColumns?.map(({ field }, index) => {
    const includesIndex = formatedColumns.findIndex((x) => x.position === index);

    if (includesIndex !== -1) {
      // to return null for next iteration if it spans over 2 columns
      skipTableCell = formatedColumns[includesIndex]?.colSpan === 2;
      return (
        <TableCell
          key={field}
          className={style.tableCell}
          colSpan={formatedColumns[includesIndex]?.colSpan}
        >
          {headerTitles[field]}
        </TableCell>
      );
    }

    if (skipTableCell) {
      skipTableCell = false;
      return null;
    }

    return <TableCell key={field} />;
  });

  return (
    <>
      <TableHead>
        <TableRow>{contentView}</TableRow>
      </TableHead>
      <MTableHeader {...props} />
    </>
  );
};

export default CustomCounterpartyTableHeader;
