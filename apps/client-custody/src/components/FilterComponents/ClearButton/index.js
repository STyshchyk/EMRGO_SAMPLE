import { useTranslation } from 'react-i18next';

import { Button, Grid, Box } from '@mui/material';

import { useFilters } from 'context/filter-context';

const ClearButton = ({ label, disabled }) => {
  const { t } = useTranslation(['miscellaneous']);

  const filterContext = useFilters();
  const { setFilters, filters } = filterContext;

  const isDisabledAFunction = typeof disabled === 'function';

  return (
    <Box mt={4} mb={1}>
      <Grid container className="h-full" alignContent="flex-end">
        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            color="primary"
            variant="outlined"
            onClick={() => {
              setFilters({});
            }}
            disabled={isDisabledAFunction ? disabled(filters) : disabled}
          >
            {label || t('miscellaneous:Filters.Filter')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClearButton;
