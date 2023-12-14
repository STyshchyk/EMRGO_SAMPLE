import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useDeepCompareEffect from "use-deep-compare-effect";

import useWethaqAPIParams from "../hooks/useWethaqAPIParams";
import * as miscellaneousActionCreators from "../redux/actionCreators/miscellaneous";
import * as authSelectors from "../redux/selectors/auth";
import * as miscellaneousSelectors from "../redux/selectors/miscellaneous";

const FilterContext = createContext();

export const FilterProvider = ({ children, tableKey, version = "v1" }) => {
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState({
    hiddenColumns: [],
    shownColumns: [],
  });

  const [allColumns, setAllColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const dispatch = useDispatch();
  const tableConfigData = useSelector((state) =>
    miscellaneousSelectors.selectTableConfig(state, tableKey)
  );

  const tableConfig = tableConfigData ? JSON.parse(tableConfigData.value) : null;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  function setColumnValue({ shownColumns, hiddenColumns }) {
    const cleanedShownColumns = [];
    const cleanedHiddenColumns = [];

    shownColumns.forEach((column) => {
      const foundColumn = allColumns.find((allColumn) => allColumn.field === column.field);
      const cleanedColumn = {
        title: column.title,
        field: column.field,
        ...foundColumn,
      };

      cleanedColumn.defaultHidden = column?.defaultHidden;

      if (column.defaultHidden && column.defaultHidden === true) {
        cleanedHiddenColumns.push(cleanedColumn);
      } else {
        cleanedShownColumns.push(cleanedColumn);
      }
    });

    hiddenColumns.forEach((column) => {
      const foundColumn = allColumns.find((allColumn) => allColumn.field === column.field);

      const cleanedColumn = {
        title: column.title,
        field: column.field,
        ...foundColumn,
      };

      cleanedHiddenColumns.push(cleanedColumn);
    });

    const updatedColumns = {
      shownColumns: cleanedShownColumns,
      hiddenColumns: cleanedHiddenColumns,
    };

    setColumns(updatedColumns);
  }

  const fetchTableConfig = (payload) =>
    dispatch(miscellaneousActionCreators.doReadTableConfigRequest(payload));
  const updateTableConfig = (payload) =>
    dispatch(miscellaneousActionCreators.doUpdateTableConfigRequest(payload));

  useEffect(() => {
    fetchTableConfig({ keys: [tableKey] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConfig = (payload, type, isActive = true) => {
    const value = {
      filter: type === "filter" ? payload : filters,
      columns: type === "columns" ? payload : columns,
    };

    const config = {
      key: tableKey,
      value: JSON.stringify(value),
      isActive,
      version,
    };

    const settings = {
      settings: [config],
    };
    updateTableConfig(settings);
  };

  useDeepCompareEffect(() => {
    if (tableConfig !== null && tableConfigData?.version === version) {
      const fetchedColumns = tableConfig.columns;

      setColumnValue({
        shownColumns:
          fetchedColumns?.shownColumns?.length === 0 ? allColumns : fetchedColumns?.shownColumns,
        hiddenColumns: fetchedColumns?.hiddenColumns || [],
      });
    } else {
      setColumnValue({
        shownColumns: allColumns,
        hiddenColumns: [],
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableConfig || {}, allColumns]);

  function setFilterValue(value, key, label, type, isDefault = false) {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = { value, label, type, isDefault };
      return updatedFilters;
    });
  }

  function clearFilterValue(keys) {
    const updatedFilters = { ...filters };

    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        delete updatedFilters[key];
      });
    } else {
      // If keys is a single string, delete that key
      delete updatedFilters[keys];
    }

    setFilters(updatedFilters);
  }

  const providerValue = {
    filters,
    setFilters,
    setFilterValue,
    clearFilterValue,
    filterColumns: columns,
    setColumnValue,
    tableKey,
    updateConfig,
    allColumns,
    setAllColumns,
    tableData,
    setTableData,
  };

  return <FilterContext.Provider value={providerValue}>{children}</FilterContext.Provider>;
};

export const FilterConsumer = ({ children }) => (
  <FilterContext.Consumer>
    {(context) => {
      if (context === undefined) {
        throw new Error("FilterConsumer must be used within a FilterProvider");
      }
      return children(context);
    }}
  </FilterContext.Consumer>
);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
