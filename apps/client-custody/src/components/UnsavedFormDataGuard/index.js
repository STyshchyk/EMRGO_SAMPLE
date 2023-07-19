import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import RouteLeavingGuard from '../RouteLeavingGuard';

const UnsavedFormDataGuard = ({ dirty }) => {
  const history = useHistory();
  const { t } = useTranslation(['components']);

  return (
    <RouteLeavingGuard
      when={dirty}
      title={t('UnsavedFormDataGuard.title')}
      message={t('UnsavedFormDataGuard.message')}
      navigate={(location) => history.push(location)}
      shouldBlockNavigation={() => true}
    />
  );
};

export default UnsavedFormDataGuard;

UnsavedFormDataGuard.propTypes = {
  dirty: PropTypes.bool.isRequired,
};
