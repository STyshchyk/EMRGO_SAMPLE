import Icon from '@mdi/react';
import PropTypes from 'prop-types';
import { mdiCheckCircleOutline } from '@mdi/js';

import Typography from '@mui/material/Typography';

import style from './style.module.scss';

const ErrorBanner = ({ title, description, icon }) => (
  <div className={style.container}>
    <div className={style.success}>
      <div className={style.success__icon__wrapper}>
        <Icon className={style.success__icon} path={icon} size={8} title="Error Icon" />
      </div>
      <Typography variant="h4" align="center" className={style.success__title}>
        {title}
      </Typography>
      <Typography variant="h5" align="center" className={style.success__description}>
        {description}
      </Typography>
    </div>
  </div>
);

ErrorBanner.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.element,
};

ErrorBanner.defaultProps = {
  title: 'Oops!',
  description: 'Something went wrong',
  icon: mdiCheckCircleOutline,
};

export default ErrorBanner;
