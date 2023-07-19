import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
import MaterialTable from '@material-table/core';

import * as externalSecuritiesActionCreators from '../../redux/actionCreators/externalSecurities';
import * as externalSecuritiesSelectors from '../../redux/selectors/externalSecurities';
import tableStyles from '../../styles/cssInJs/materialTable';
import { useTheme } from '../../context/theme-context';

const RealtimeSecuritySearch = ({ onSecurityResultItemSelect, assetTypeFilterValue = '' }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { theme } = useTheme();

  const queryExternalSecurities = (payload) => dispatch(externalSecuritiesActionCreators.doSearchExternalSecurities(payload));
  // selectors
  const isRequesting = useSelector(externalSecuritiesSelectors.selectIsRequesting);
  const externalSecuritySearchResults = useSelector(externalSecuritiesSelectors.selectExternalSecuritySearchResultsRaw);

  const handleTextChange = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value !== '') {
      queryExternalSecurities({ query: event.target.value });
    }
  };

  const debouncedHandleTextChange = useMemo(() => debounce(handleTextChange, 300), []);

  useEffect(() => {
    const resetExtSecSearchResults = () => dispatch(externalSecuritiesActionCreators.doResetExternalSecuritiesSearchResults());

    if (searchTerm === '') {
      setSelectedRowId(null);
      resetExtSecSearchResults();
    }

    return () => {
      debouncedHandleTextChange.cancel();
      resetExtSecSearchResults();
    };
  }, [debouncedHandleTextChange, dispatch, searchTerm]);

  const handleClick = (event, rowData) => {
    setSelectedRowId(rowData?.tableData?.id);
    onSecurityResultItemSelect(rowData);
  };

  const generatedTableRowData = externalSecuritySearchResults
    .filter((i) => {
      if (!assetTypeFilterValue) return true;

      return assetTypeFilterValue === i.assetType?.value;
    })
    .map((i) => ({
      externalSecurityId: i.externalSecurityId,
      securityName: i.securityName,
      matchType: i.match?.value,
      identifier: i.identifier,
      assetType: i.assetType?.value,
    }));

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={5} lg={5}>
          <Typography>Security Search</Typography>
        </Grid>
        <Grid item xs={12} md={7} lg={7} className="px-1">
          <TextField onChange={debouncedHandleTextChange} variant="filled" fullWidth />
        </Grid>
      </Grid>
      <Grid item>
        <MaterialTable
          size="small"
          title=""
          style={{
            boxShadow: 'none',
          }}
          columns={[
            {
              id: 'securityName',
              title: 'Security Name',
              field: 'securityName',
            },
            {
              id: 'matchType',
              title: 'Match Type',
              field: 'matchType',
            },
            {
              id: 'identifier',
              title: 'Identifier',
              field: 'identifier',
            },
            {
              id: 'assetType',
              title: 'Asset Type',
              field: 'assetType',
            },
          ]}
          options={{
            ...tableStyles,
            toolbar: false,
            pageSize: 5,
            search: false,
            draggable: false,
            rowStyle: (rowData) => ({
              backgroundColor: selectedRowId === rowData.tableData.id ? theme?.muiTheme?.palette?.secondary?.main : null,
              color: selectedRowId === rowData.tableData.id ? theme?.muiTheme?.palette?.secondary?.contrastText : null,
              cursor: 'pointer',
            }),
          }}
          data={generatedTableRowData}
          isLoading={isRequesting}
          onRowClick={handleClick}
        />
      </Grid>
    </Grid>
  );
};

export default RealtimeSecuritySearch;
