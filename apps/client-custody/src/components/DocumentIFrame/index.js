import Iframe from 'react-iframe';
import PropTypes from 'prop-types';

import style from './style.module.scss';

const DocumentIFrame = ({ url }) => <Iframe url={url} className={style.iframe} position="relative" width="100%" height="100%" />;

export default DocumentIFrame;

DocumentIFrame.propTypes = {
  url: PropTypes.string.isRequired,
};
