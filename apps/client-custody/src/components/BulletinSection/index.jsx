import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import changeCase from "change-case";
import cx from "classnames";
import PropTypes from "prop-types";

import accessControlsList from "../../constants/accessControlsList";
import { useTheme } from "../../context/theme-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as authSelectors from "../../redux/selectors/auth";
import style from "./style.module.scss";

const headerStyle = {
  backgroundColor: "#23389c",
  color: "#FFF",
  fontWeight: "bold",
  padding: "4px",
};

const cellStyle = {
  paddingLeft: "4px",
  paddingRight: "4px",
};

const BulletinSection = ({
  data,
  setCurrentBulletin,
  setIsDocumentModalOpen,
  setDeleteBulletinConfirmationModal,
  fetchBulletinDocument,
  setShowUpdateBulletinModal,
}) => {
  const { t } = useTranslation(["translation", "bulletin"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const mtableLocalization = useMaterialTableLocalization();
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const hasEditBulletinEdit = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === accessControlsList.KYC.manage.key
  );

  const actions = hasEditBulletinEdit
    ? [
        {
          icon: "edit",
          tooltip: t("bulletin:Edit Bulletin"),
          onClick: (event, rowData) => {
            setCurrentBulletin(rowData);
            setShowUpdateBulletinModal(true);
          },
        },
        () => ({
          icon: "delete",
          tooltip: t("bulletin:Delete Bulletin"),
          onClick: (event, rowData) => {
            setCurrentBulletin(rowData);
            setDeleteBulletinConfirmationModal(true);
          },
        }),
      ]
    : [];

  const columns = [
    {
      title: t("bulletin:Date"),
      field: "itemDate",
      type: "date",
      width: "10%",
      cellStyle: { ...cellStyle },
    },
  ];

  if (hasEditBulletinEdit) {
    columns.push({
      title: t("bulletin:Title"),
      field: "title",
      width: "70%",
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 100,
        ...cellStyle,
      },
    });
    columns.push({
      title: t("bulletin:Author"),
      field: "user.firstName",
      cellStyle: { ...cellStyle },
    });
  } else {
    columns.push({
      title: t("bulletin:Title"),
      field: "title",
      width: "90%",
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 100,
        ...cellStyle,
      },
    });
  }

  const viewDocument = (rowData) => {
    setCurrentBulletin(rowData);
    fetchBulletinDocument({ key: rowData.documentId });
    setIsDocumentModalOpen(true);
  };

  // I know this is a dirty hack, if you came to this point while debugging, feel free to ask backend for this translation
  const getTranslatedType = (item) =>
    locale.altLocale === "ar-sa" ? item.type.nameAr : item.type.name;

  return (
    <Box
      py={2}
      className={cx(hasEditBulletinEdit ? style.container__full : style.container__half)}
      data-testid="bulletin-table"
    >
      <MaterialTable
        title={getTranslatedType(data.items[0])}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => {
            // eslint-disable-next-line react/prop-types
            const { title } = props;
            return (
              <Typography variant="h6" className={style.table__title}>
                {changeCase.titleCase(title)}
              </Typography>
            );
          },
        }}
        columns={columns}
        data={data.items}
        options={{
          search: false,
          paging: false,
          actionsColumnIndex: -1,
          headerStyle,
          maxBodyHeight: 250,
          padding: "dense",
        }}
        actions={actions}
        onRowClick={(event, rowData) => viewDocument(rowData)}
        localization={mtableLocalization}
      />
    </Box>
  );
};

BulletinSection.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    items: PropTypes.array,
    type: PropTypes.string,
  }),
  setCurrentBulletin: PropTypes.func.isRequired,
  setIsDocumentModalOpen: PropTypes.func.isRequired,
  setDeleteBulletinConfirmationModal: PropTypes.func.isRequired,
  fetchBulletinDocument: PropTypes.func.isRequired,
  setShowUpdateBulletinModal: PropTypes.func.isRequired,
};

BulletinSection.defaultProps = {
  data: {},
};

export default BulletinSection;
