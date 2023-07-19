import { mdiCancel } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import ErrorBanner from '../ErrorBanner';

const AbsherAuthPromptDialog = ({ open, handleClose, absherURL }) => {
  const { t } = useTranslation(['auth']);

  return (
    <Dialog maxWidth="lg" open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
      <DialogContent>
        <div
          style={{
            marginBottom: '2rem',
          }}
        >
          <ErrorBanner
            title={t('auth:Absher Authentication Failed')}
            description={t('auth:Something went wrong during your Absher authentication Please verify your credentials and try again')}
            icon={mdiCancel}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button href={absherURL} variant="contained" color="primary">
          {t('auth:Buttons.Try Again')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbsherAuthPromptDialog;
