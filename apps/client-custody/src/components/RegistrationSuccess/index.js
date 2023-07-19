import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';
import { mdiCheckCircleOutline } from '@mdi/js';

import ActionButton from '../ActionButton';
import routes from '../../constants/routes';
import generatePath from '../../helpers/generatePath';

import style from './style.module.scss';

const RegistrationSuccess = () => {
  const { t } = useTranslation(['auth']);
  return (
    <div className={style.container}>
      <div className={style.success}>
        <div className={style.success__icon__wrapper}>
          <Icon className={style.success__icon} path={mdiCheckCircleOutline} size={8} title={t('auth:Action Complete')} />
        </div>
        <span className={style.success__descriptor}>
          {t('auth:You have successfully been registered')}
          <br />
        </span>
        <ActionButton link={generatePath(routes.public.login)} text={t('auth:Buttons.Back to Login')} hideArrow logoColor />
      </div>
    </div>
  );
};

export default RegistrationSuccess;
