import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation, Link, useRouteMatch } from 'react-router-dom';
import style from './style.module.scss';

const Pill = ({ route }) => {
  const { t } = useTranslation();
  const isActive = useRouteMatch(route.path);

  return (
    <div className={style.pillContainer}>
      <div className={style.pillTextWrapper} data-testid={t(`${route.text}`)}>
        <Link className={cx(style.pillText, isActive ? style.selected : '')} to={route.link}>
          {t(`${route.text}`)}
        </Link>
      </div>
      <div className={cx(style.pillIndicator, isActive ? style.selectedLine : '')} />
    </div>
  );
};

Pill.propTypes = {
  route: PropTypes.shape({
    link: PropTypes.string,
    text: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
};

/**
 *  @deprecated
 */
const MinorNavigation = ({ routes, currentAccessList }) => {
  const location = useLocation();

  // * FIXME: ACL config evaluating logic doesn't work as expected
  const getLinks = (links, accessList) => {
    const entries = [];
    links
      .filter((i) => !i?.disabled)
      .forEach((link) => {
        let isVisible = false;
        if (link.acls) {
          link.acls.forEach((permission) => {
            isVisible = isVisible ? true : accessList.find((module) => module.key === permission);
          });
        } else {
          isVisible = true;
        }
        if (isVisible) {
          entries.push(<Pill route={link} key={link.link} />);
        }
      });
    return entries;
  };

  const paths = routes.map((route) => route.link);

  const index = paths.indexOf(location.pathname);
  return (
    <div className={style.pillMenuWrapper} data-testid="minor-nav">
      <div className={style.pillMenuContainer}>{getLinks(routes, currentAccessList, index)}</div>
    </div>
  );
};

MinorNavigation.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentAccessList: PropTypes.arrayOf(PropTypes.shape({})),
};

MinorNavigation.defaultProps = {
  currentAccessList: [],
};

export default MinorNavigation;
