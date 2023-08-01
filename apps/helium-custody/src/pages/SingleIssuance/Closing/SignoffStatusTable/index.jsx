import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import PropTypes from "prop-types";

import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";

const SignoffStatusTable = ({ tableData }) => {
  const { t } = useTranslation(["closing"]);
  const mtableLocalization = useMaterialTableLocalization();
  return (
    <MaterialTable
      columns={[
        {
          title: t("closing:Headers.Party"),
          field: "party",
        },
        {
          title: t("closing:Headers.Role"),
          field: "role",
          defaultSort: "asc",
          // render: (rowData) => <strong>{t(`closing:Roles.${rowData.role}`)}</strong>,
          render: (rowData) =>
            rowData.role === "Fiduciary" ? (
              <strong>{t(`closing:Roles.SPE Trustee`)}</strong>
            ) : (
              <strong>{t(`closing:Roles.${rowData.role}`)}</strong>
            ),
        },
        {
          title: t("closing:Headers.Signoff Status"),
          field: "signOffStatus",
          defaultSort: "asc",
          render: (rowData) => {
            switch (rowData?.signOffStatus) {
              case "Signoff Pending":
                return (
                  <strong style={{ color: "orange" }}>
                    {t(`closing:Status.${rowData?.signOffStatus}`)}
                  </strong>
                );
              case "Signoff Complete":
                return (
                  <strong style={{ color: "green" }}>
                    {t(`closing:Status.${rowData?.signOffStatus}`)}
                  </strong>
                );
              default:
                return <strong>--</strong>;
            }
          },
        },
      ]}
      data={tableData}
      options={{
        draggable: false,
        headerStyle: {
          fontWeight: "bold",
          color: "#23389c",
          fontSize: "1rem",
        },
        pageSize: 10,
        search: false,
        showTitle: false,
        toolbar: false,
        toolbarButtonAlignment: "right",
        rowStyle: {
          fontWeight: "bold",
        },
      }}
      localization={mtableLocalization}
    />
  );
};

SignoffStatusTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      party: PropTypes.string,
      role: PropTypes.string,
      signOffStatus: PropTypes.string,
      entityGroupID: PropTypes.string,
    })
  ).isRequired,
};

export default SignoffStatusTable;
