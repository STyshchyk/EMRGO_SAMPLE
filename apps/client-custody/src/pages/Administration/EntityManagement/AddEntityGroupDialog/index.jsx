import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { titleCase } from "change-case";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import * as entityGroupsActionCreators from "../../../../redux/actionCreators/entityGroups";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import * as entityGroupsSelectors from "../../../../redux/selectors/entityGroups";
import AddEntityGroupForm from "../AddEntityGroupForm";

const AddEntityGroupDialog = ({ entityId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(entityGroupsSelectors.selectIsSubmitting);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const selectedEntity = entities.find((i) => i.id === entityId);
  const { validGroupTypes } = selectedEntity;
  // const validGroupTypeOptions = validGroupTypes.map((i) => ({
  //   label: titleCase(i.entityType),
  //   value: i.entityType,
  // }));

  const validGroupTypeOptions = validGroupTypes.map((i) =>
    i.entityType === "FIDUCIARY"
      ? { label: titleCase("SPE Trustee"), value: "FIDUCIARY" }
      : { label: titleCase(i.entityType), value: i.entityType }
  );

  const handleSubmit = (values, actions) => {
    const addEntityGroup = (payload) =>
      dispatch(entityGroupsActionCreators.doAddEntityGroup(payload));

    const requestPayload = {
      name: values.name,
      type: values.entityType,
      entityId,
    };

    addEntityGroup({
      requestPayload,
    });

    actions.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="add-parent-entity-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>Add Entity Group</strong>
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
            <AddEntityGroupForm
              initialValues={{
                name: "",
                entityType: "",
              }}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
              options={{
                validGroupTypeOptions,
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddEntityGroupDialog.propTypes = {};

export default AddEntityGroupDialog;
