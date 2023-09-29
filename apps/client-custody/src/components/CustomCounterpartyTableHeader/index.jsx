import { colors } from "@emrgo-frontend/theme";
import { MTableHeader } from "@material-table/core";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDarkMode } from "usehooks-ts";

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
  const { columns } = props;
  const { isDarkMode } = useDarkMode();

  const cellStyle = {
    padding: "16px 8px",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: isDarkMode ? colors.white[100] : colors.green3,
  };

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

  columns?.map(({ field }, index) => {
    if (groupByTypes[field]) {
      orderOfColumns.push({ position: index, fieldType: groupByTypes[field] });
    } else {
      orderOfColumns.push({});
    }
  });

  const formatedColumns = setColSpan(orderOfColumns);

  let skipTableCell = false;
  const contentView = columns?.map(({ field }, index) => {
    const includesIndex = formatedColumns.findIndex((x) => x.position === index);

    if (includesIndex !== -1) {
      skipTableCell = formatedColumns[includesIndex]?.colSpan === 2;
      return (
        <TableCell key={field} style={cellStyle} colSpan={formatedColumns[includesIndex]?.colSpan}>
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
