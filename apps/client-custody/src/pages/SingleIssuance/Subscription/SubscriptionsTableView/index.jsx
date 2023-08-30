import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import v from "voca";
import PropTypes from "prop-types";

import statusesList from "../../../../constants/wethaqAPI/statusesList";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";

const SubscriptionsTableView = ({ data }) => {
  const { t } = useTranslation(["subscription"]);
  const mtableLocalization = useMaterialTableLocalization();
  return (
    <MaterialTable
      columns={[
        {
          title: t("subscription:Pre-Allocation Finalization.Headers.Investor"),
          field: "investor",
        },
        {
          title: t("subscription:Pre-Allocation Finalization.Headers.Pre-Allocation Amount"),
          field: "subAmount",
          type: "numeric",
        },
        {
          title: t("subscription:Pre-Allocation Finalization.Headers.Certificates"),
          field: "certificates",
          type: "numeric",
        },
        {
          title: t(
            "subscription:Pre-Allocation Finalization.Headers.Expression of Interest Status"
          ),
          field: "eoiStatus",
          cellStyle: (rowData) => {
            const baseStyles = {
              fontWeight: "bold",
              color: "red",
            };

            if (
              rowData === v.capitalize(statusesList.subscription.SUBSCRIPTION_CONFIRMATION_PENDING)
            ) {
              return { ...baseStyles, color: "orange" };
            }

            if (rowData === v.capitalize(statusesList.subscription.SUBSCRIPTION_CONFIRMED)) {
              return { ...baseStyles, color: "green" };
            }
            return { ...baseStyles };
          },
          render: (rowData) => t(`subscription:Status.${rowData.eoiStatus}`),
        },
      ]}
      data={data}
      options={{
        showTitle: false,
        toolbarButtonAlignment: "right",
        draggable: false,
        headerStyle: {
          fontWeight: "bold",
          color: "#23389c",
          fontSize: "1rem",
        },
      }}
      localization={mtableLocalization}
    />
  );
};

SubscriptionsTableView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      investor: PropTypes.string,
      subAmount: PropTypes.number,
      certificates: PropTypes.number,
      eoiStatus: PropTypes.string,
    })
  ).isRequired,
};

export default SubscriptionsTableView;
