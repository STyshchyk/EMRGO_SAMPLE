import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useFilters } from 'context/filter-context';

const ReportingTableFiltersWrapper = ({ columns, children }) => {
  const filterContext = useFilters();
  const { setAllColumns } = filterContext;
  const { t } = useTranslation(['miscellaneous']);

  useEffect(() => {
    setAllColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div
        style={{
          width: '100%',
        }}
      >
        {children}
      </div>
    </Fragment>
  );
};

ReportingTableFiltersWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ReportingTableFiltersWrapper;
