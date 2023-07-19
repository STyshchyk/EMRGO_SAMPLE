import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

export default function RenameDialog({ entry, open, onClose, onSubmit }) {
  const [value, setValue] = useState('');
  const { t } = useTranslation(['documents']);
  const handleSubmit = () => {
    onSubmit({ documentId: entry.id, displayName: value });
  };

  return (
    <div>
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} aria-labelledby="rename-title">
        <DialogTitle style={{ cursor: 'move' }} id="rename-title">
          {t('documents:Rename Dialog.Rename File')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('documents:Rename Dialog.Current Name')}: {entry.displayName || t('documents:Rename Dialog.NA')}
          </DialogContentText>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: 30 }}>{t('documents:Rename Dialog.New File Name')}</p>
            <input type="text" onChange={(e) => setValue(e.target.value)} value={value} style={{ border: 'none', borderBottom: '2px dotted #ccc', outline: 'none', padding: '2px 5px' }} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
            {t('documents:Rename Dialog.Cancel')}
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {t('documents:Rename Dialog.Submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
