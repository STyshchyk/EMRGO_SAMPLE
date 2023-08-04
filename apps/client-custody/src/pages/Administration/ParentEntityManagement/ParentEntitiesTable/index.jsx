import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import LoadingPage from "../../../../components/LoadingPage";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import AddParentEntityForm from "../AddParentEntityForm";

const EditParentEntityFormDialog = ({ parentEntityId, initialValues, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);

  const handleSubmit = (values, actions) => {
    const updateParentEntity = (payload) =>
      dispatch(entitiesActionCreators.doUpdateParentEntity(payload));

    const requestPayload = {
      entityParentName: values.name,
      description: values.description,
    };

    updateParentEntity({
      parentEntityId,
      requestPayload,
    });
    actions.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="edit-parent-entity-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>Edit Parent Entity Form</strong>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isSubmitting ? (
            <div>
              <LoadingIndicator />
              <p>Your form submission is being processed</p>
            </div>
          ) : (
            <AddParentEntityForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const DeactivateParentEntityFormDialog = ({ parentEntityId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);

  const handleSubmit = () => {
    const deactivateParentEntity = (payload) =>
      dispatch(entitiesActionCreators.doDeactivateParentEntity(payload));

    deactivateParentEntity({
      parentEntityId,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="deactivate-parent-entity-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>Deactivate Parent Entity</strong>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>Please confirm that you wish to deactivate this account</DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          <strong>Confirm</strong>
        </Button>
        <Button onClick={handleClose} color="primary">
          <strong>Cancel</strong>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const generateInitialValues = (rowData) => ({
  name: rowData?.name,
  description: rowData?.description,
});

const TableActionMenu = ({ rowData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditParentEntityFormDialog, setOpenEditParentEntityFormDialog] = useState(false);
  const [openDeactivateParentEntityDialog, setOpenDeactivateParentEntityDialog] = useState(false);
  const { t } = useTranslation(["administration"]);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-label="action"
        size="small"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock
      >
        <MenuItem
          onClick={() => {
            setOpenEditParentEntityFormDialog(true);
          }}
        >
          {t("administration:ParentEntity.ParentEntityTable.ContextMenu.Amend")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeactivateParentEntityDialog(true);
          }}
        >
          {t("administration:ParentEntity.ParentEntityTable.ContextMenu.Deactivate")}
        </MenuItem>
      </Menu>
      <EditParentEntityFormDialog
        parentEntityId={rowData.id}
        initialValues={generateInitialValues(rowData)}
        open={openEditParentEntityFormDialog}
        handleClose={() => {
          setOpenEditParentEntityFormDialog(false);
          handleCloseMenu();
        }}
      />
      <DeactivateParentEntityFormDialog
        parentEntityId={rowData.id}
        open={openDeactivateParentEntityDialog}
        handleClose={() => {
          setOpenDeactivateParentEntityDialog(false);
          handleCloseMenu();
        }}
      />
    </Fragment>
  );
};

const ParentEntitiesTable = ({ tableData, isAdmin }) => {
  const { t } = useTranslation(["administration"]);
  const mtableLocalization = useMaterialTableLocalization();
  const isFetching = useSelector(entitiesSelectors.selectIsFetching);

  if (isFetching) {
    return <LoadingPage />;
  }

  return (
    <MaterialTable
      size="small"
      title=""
      columns={[
        {
          title: `${t("administration:ParentEntity.ParentEntityTable.Headers.ParentEntity")}`,
          field: "name",
          defaultSort: "asc",
        },
        {
          title: `${t("administration:ParentEntity.ParentEntityTable.Headers.Description")}`,
          field: "description",
          width: "100%",
        },
        {
          title: `${t("administration:ParentEntity.ParentEntityTable.Headers.Actions")}`,
          sorting: false,
          searchable: false,
          render: (rowData) => <TableActionMenu rowData={rowData} />,
          hidden: !isAdmin,
        },
      ]}
      data={tableData}
      options={{
        searchFieldVariant: "outlined",
        pageSize: 10,
      }}
      localization={mtableLocalization}
    />
  );
};

ParentEntitiesTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default ParentEntitiesTable;
