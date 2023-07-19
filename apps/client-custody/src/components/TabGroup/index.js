import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import cx from 'classnames';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const TabGroup = ({ routes, primaryAction }) => {
  const history = useHistory();
  const location = useLocation();

  const handleClick = (route) => {
    history.push(route.link);
  };

  const paths = routes.map((route) => route.link);

  const index = paths.indexOf(location.pathname);

  return (
    <Grid container alignContent="center">
      <Grid item xs={8} sm={8} md={9} lg={9}>
        <Tabs value={index} indicatorColor="secondary" textColor="primary" variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
          {routes.map((route) => (
            <Tab key={route.text} onClick={() => handleClick(route)} label={route.text} {...a11yProps(0)} disabled={route.disabled} />
          ))}
        </Tabs>
      </Grid>
      <Grid item container xs={4} sm={4} md={3} lg={3} justifyContent="flex-end" alignContent="center">
        {primaryAction}
      </Grid>
    </Grid>
  );
};

TabGroup.propTypes = {
  primaryAction: PropTypes.node,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TabGroup.defaultProps = {
  primaryAction: null,
};

export default TabGroup;
