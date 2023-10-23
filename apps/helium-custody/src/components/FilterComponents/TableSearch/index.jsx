import { useState } from "react";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  ButtonBase,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { useFilters } from "../../../context/filter-context";

const TableSearch = ({ name, label, tableRef, toolbar = false }) => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation(["miscellaneous"]);
  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;

  const tableSearch = (updatedSearchValue) => {
    if (!tableRef.current?.dataManager) return;
    tableRef.current.dataManager.changeSearchText(updatedSearchValue);
    tableRef.current.setState({ updatedSearchValue });
    tableRef.current.setState(tableRef.current.dataManager.getRenderState());
  };

  const onSearchChange = (updatedSearchValue) => {
    setSearchValue(updatedSearchValue);
    setFilterValue(updatedSearchValue, name, label, "text");

    if (tableRef) {
      tableSearch(updatedSearchValue);
    }
  };

  const clearSearchFilter = () => {
    clearFilterValue(name);
    if (tableRef) {
      tableSearch("");
    }
  };

  return (
    <Grid container>
      {toolbar && (
        <Grid container justifyContent="space-between">
          <Grid item xs={9} container alignContent="center" justifyContent="flex-start">
            <Typography variant="body1" className="bold">
              {t("miscellaneous:Filters.Search")}
            </Typography>
          </Grid>
          <Grid item xs={3} container justifyContent="flex-end">
            <ButtonBase onClick={() => clearSearchFilter("range")}>
              <Typography variant="caption">{t("miscellaneous:Clear")}</Typography>
            </ButtonBase>
          </Grid>
        </Grid>
      )}

      <Grid item xs={11} my={1} className="w-full">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value === "") {
                  setSearchValue("");
                  clearSearchFilter("search");
                }
              }}
              label={t("miscellaneous:Filters.Search")}
              name="searchText"
              value={searchValue}
              size="small"
              variant="outlined"
              InputProps={{
                endAdornment: !toolbar && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchValue("");
                        clearSearchFilter("search");
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TableSearch;
