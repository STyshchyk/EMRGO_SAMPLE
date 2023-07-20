import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import Button from "../../../components/Button";
import LoadingIndicator from "../../../components/LoadingIndicator";
import PageTitle from "../../../components/PageTitle";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import AddParentEntityForm from "./AddParentEntityForm";
import ParentEntitiesTable from "./ParentEntitiesTable";

const AddParentEntityFormDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);

  const handleSubmit = (values, actions) => {
    const addParentEntity = (payload) =>
      dispatch(entitiesActionCreators.doAddParentEntity(payload));

    const requestPayload = {
      entityParentName: values.name,
      description: values.description,
    };

    addParentEntity({
      requestPayload,
    });
    actions.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="add-parent-entity-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>Add Parent Entity Form</strong>
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
              initialValues={{
                name: "",
                description: "",
              }}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddParentEntityFormDialog.props = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const createParentEntitiesTableData = (parentEntity) => ({
  id: parentEntity.id,
  name: parentEntity.entityParentName,
  description: parentEntity.description,
});

const ParentEntityManagement = () => {
  const { t } = useTranslation(["administration"]);

  const dispatch = useDispatch();
  const [openAddParentEntityFormDialog, setOpenAddParentEntityFormDialog] = useState(false);
  const fetchAllParentEntity = (payload) =>
    dispatch(entitiesActionCreators.doFetchParentEntities(payload));
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const parentEntities = useSelector(entitiesSelectors.selectParentEntities);

  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const payloadData = {
    currentGroupId: currentEntityGroupID,
  };

  const isAdmin = entityType === "EMRGO_SERVICES";

  useEffect(() => {
    fetchAllParentEntity(payloadData);
  }, []);

  useWethaqAPIParams(payloadData);

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={6}>
          <PageTitle title={t("administration:ParentEntity.ParentEntities")} />
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end" alignItems="flex-start">
          {isAdmin && (
            <Button
              color="secondary"
              onClick={() => {
                setOpenAddParentEntityFormDialog(true);
              }}
            >
              {`+ ${t("administration:ParentEntity.Buttons.New Parent Entity")}`}
            </Button>
          )}
        </Grid>
      </Grid>
      <ParentEntitiesTable
        tableData={parentEntities.map((i) => createParentEntitiesTableData(i))}
        isAdmin
      />
      <AddParentEntityFormDialog
        open={openAddParentEntityFormDialog}
        handleClose={() => {
          setOpenAddParentEntityFormDialog(false);
        }}
      />
    </Fragment>
  );
};

export default ParentEntityManagement;
