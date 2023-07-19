import { Fragment } from 'react';
import PropTypes from 'prop-types';

import appConfig from '../../appConfig';

const defaultRegion = appConfig.appRegion;
// const defaultRegion = 'SA';

const RegionSwitch = ({ region, sa, ae }) => {
  const renderSwitch = () => {
    switch (region) {
      case 'SA':
        return <Fragment>{sa}</Fragment>;
      case 'AE':
        return <Fragment>{ae}</Fragment>;
      default:
        return '';
    }
  };

  return <Fragment>{renderSwitch()}</Fragment>;
};

RegionSwitch.propTypes = {
  region: PropTypes.string,
  sa: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  ae: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

RegionSwitch.defaultProps = {
  region: defaultRegion,
  sa: '',
  ae: '',
};

export default RegionSwitch;
