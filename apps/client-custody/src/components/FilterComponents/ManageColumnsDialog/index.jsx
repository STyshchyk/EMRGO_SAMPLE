import { Fragment, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";

import { DraggableColumnItem, DraggableColumnWrapper } from "@emrgo-frontend/shared-ui";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import cx from "classnames";

import { useFilters } from "../../../context/filter-context";
import style from "./style.module.scss";

const ManageColumnsDialog = ({ open, closeDialog, openResetColumnsDialog }) => {
  const { t } = useTranslation(["miscellaneous"]);

  const filterContext = useFilters();
  const { filterColumns, updateConfig } = filterContext;
  const { hiddenColumns, shownColumns } = filterColumns;
  const [currentShownColumns, setCurrentShownColumns] = useState(shownColumns);
  const [currentHiddenColumns, setCurrentHiddenColumns] = useState(hiddenColumns);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const getList = (id) => {
    let returnable = null;
    if (id === "shown") {
      returnable = currentShownColumns;
    } else {
      returnable = currentHiddenColumns;
    }
    return returnable;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // dropped outside the list
    if (destination) {
      if (source.droppableId === destination.droppableId) {
        const currentItems = reorder(getList(source.droppableId), source.index, destination.index);
        if (source.droppableId === "shown") {
          setCurrentShownColumns(currentItems);
        } else {
          setCurrentHiddenColumns(currentItems);
        }
      } else {
        const currentResult = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
        );
        setCurrentShownColumns(currentResult.shown);
        setCurrentHiddenColumns(currentResult.hidden);
      }
    }
  };

  const swapColumns = () => {
    const tempShownColumns = currentShownColumns;
    setCurrentShownColumns(currentHiddenColumns);
    setCurrentHiddenColumns(tempShownColumns);
  };

  const moveHiddenColumns = () => {
    setCurrentShownColumns([...currentHiddenColumns, ...currentShownColumns]);
    setCurrentHiddenColumns([]);
  };

  const moveShownColumns = () => {
    setCurrentHiddenColumns([...currentShownColumns, ...currentHiddenColumns]);
    setCurrentShownColumns([]);
  };

  const getItemStyle = (isDragging) =>
    isDragging ? style["columnManager__column--active"] : style["columnManager__column--inactive"];

  const getListStyle = (isDraggingOver) =>
    isDraggingOver ? style["columnManager__list--active"] : style["columnManager__list--inactive"];

  const confirmColumns = () => {
    updateConfig(
      {
        shownColumns: currentShownColumns,
        hiddenColumns: currentHiddenColumns,
      },
      "columns"
    );
  };

  const handleResetConfirmClick = () => {
    openResetColumnsDialog();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => closeDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("Manage Columns Dialogue.Manage Columns")}
      </DialogTitle>
      <DialogContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container justifyContent="space-between">
            <Grid item xs={5}>
              <Grid container justifyContent="space-between" alignContent="center">
                <Grid item xs={6} container justifyContent="flex-start" alignContent="center">
                  <Typography variant="body1" align="left">
                    {t("Manage Columns Dialogue.Hidden Columns")}
                  </Typography>
                </Grid>
                <Tooltip
                  title={t("Manage Columns Dialogue.Move all Hidden Columns")}
                  placement="top"
                  aria-label="move hidden"
                >
                  <IconButton
                    aria-label="move columns"
                    onClick={() => {
                      moveHiddenColumns();
                    }}
                    size="large"
                  >
                    <ArrowForwardIcon color="secondary" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Droppable droppableId="hidden">
                {(provided, snapshot) => (
                  <DraggableColumnWrapper ref={provided.innerRef} snapshot={snapshot}>
                    {currentHiddenColumns
                      //   .filter((column) => !entityTypeFilteredColumns.includes(column.field))
                      .map((item, index) => (
                        <Draggable
                          key={`${item.field}-${item.title}}`}
                          draggableId={`${item.field}-${item.title}}`}
                          index={index}
                        >
                          {(currentProvided, currentSnapshot) => (
                            <DraggableColumnItem
                              ref={currentProvided.innerRef}
                              snapshot={currentSnapshot}
                              isDisplayed={false}
                              {...currentProvided.draggableProps}
                              {...currentProvided.dragHandleProps}
                              style={{ ...currentProvided.draggableProps.style }}
                            >
                              {item.title}
                            </DraggableColumnItem>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </DraggableColumnWrapper>
                )}
              </Droppable>
            </Grid>
            <Grid item xs={2} container justifyContent="center" alignContent="flex-start">
              <div className={style.columnManager__swap__wrapper}>
                <IconButton
                  aria-label="swap column selection"
                  disableRipple
                  disableFocusRipple
                  onClick={() => {
                    swapColumns();
                  }}
                  size="large"
                >
                  <Tooltip
                    title={t("Manage Columns Dialogue.Swap all Columns")}
                    placement="top"
                    aria-label="swap columns"
                  >
                    <SwapHorizontalCircleIcon
                      color="primary"
                      fontSize="large"
                      className={style.columnManager__swap__icon}
                    />
                  </Tooltip>
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={5}>
              <Grid container justifyContent="space-between" alignContent="center">
                <Tooltip
                  title={t("Manage Columns Dialogue.Move all Shown Columns")}
                  placement="top"
                  aria-label="move shown"
                >
                  <IconButton
                    aria-label="move columns"
                    onClick={() => {
                      moveShownColumns();
                    }}
                    size="large"
                  >
                    <ArrowBackIcon color="secondary" fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Grid item xs={6} container justifyContent="flex-end" alignContent="center">
                  <Typography variant="body1" align="right">
                    {t("Manage Columns Dialogue.Displayed Columns")}
                  </Typography>
                </Grid>
              </Grid>
              <Droppable droppableId="shown">
                {(provided, snapshot) => (
                  <DraggableColumnWrapper ref={provided.innerRef} snapshot={snapshot}>
                    {currentShownColumns
                      //   .filter((column) => !entityTypeFilteredColumns.includes(column.field))
                      .map((item, index) => (
                        <Draggable
                          key={`${item.field}-${item.title}}`}
                          draggableId={`${item.field}-${item.title}}`}
                          index={index}
                        >
                          {(currentProvided, currentSnapshot) => (
                            <DraggableColumnItem
                              ref={currentProvided.innerRef}
                              snapshot={currentSnapshot}
                              isDisplayed={true}
                              {...currentProvided.draggableProps}
                              {...currentProvided.dragHandleProps}
                              style={{ ...currentProvided.draggableProps.style }}
                            >
                              {item.title}
                            </DraggableColumnItem>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </DraggableColumnWrapper>
                )}
              </Droppable>
            </Grid>
          </Grid>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="space-between" className="px-8 py-2">
          <Grid item>
            <Button
              onClick={() => handleResetConfirmClick()}
              variant="outlined"
              className="border-red-500 text-red-500"
            >
              {t("Manage Columns Dialogue.Reset Columns")}
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => closeDialog()} color="primary">
              {t("Manage Columns Dialogue.Cancel")}
            </Button>
            <Button
              onClick={() => {
                confirmColumns();
                closeDialog();
              }}
              variant="contained"
              color="primary"
            >
              {t("Manage Columns Dialogue.Confirm Columns")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default ManageColumnsDialog;
