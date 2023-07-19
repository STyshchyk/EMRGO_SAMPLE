import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import regionSwitcher from '../../helpers/regions';
import style from './style.module.scss';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={style.footer}>
      <ul className="nav-menu">
        <li className="nav-menu__item">
          <Link to="/" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.Home')}
          </Link>
        </li>
        <li className="nav-menu__item">
          <Link to="/" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.About Us')}
          </Link>
        </li>
        <li className="nav-menu__item">
          <Link to="/" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.Contact')}
          </Link>
        </li>
        <li className="nav-menu__item">
          <Link to="/" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.Terms of Use')}
          </Link>
        </li>
        <li className="nav-menu__item">
          <Link to="/" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.Privacy Policy')}
          </Link>
        </li>
        <li className="nav-menu__item">
          <Link to="/onboarding" className="nav-link nav-link--primary">
            {t('Public Layout.Footer.Onboarding')}
          </Link>
        </li>
      </ul>
      <hr />
      <p className={style['footer__copyright-text']}>
        {regionSwitcher({
          ae: `${t('Public Layout.Footer.Emrgo (DIFC) Ltd | All rights reserved', { code: '©', year: new Date().getFullYear() })}`,
          sa: `${t('Public Layout.Footer.Emrgo Capital Platform JSC | All rights reserved', { code: '©', year: new Date().getFullYear() })}`,
        })}
      </p>
    </footer>
  );
};

export default Footer;
