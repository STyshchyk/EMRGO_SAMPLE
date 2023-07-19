import { Fragment } from 'react';
import { MTableAction } from '@material-table/core';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const MaterialTableCustomButtonRenderer = (props) => {
  const { action } = props;
  return (
    <Fragment>
      {typeof action === typeof Function ? (
        <Fragment>
          <MTableAction {...props} iconProps={{ color: 'primary' }} />
        </Fragment>
      ) : (
        <Fragment>
          {
            {
              Add: (
                <Button className="ml-2" size="large" startIcon={<AddIcon />} onClick={(event) => props.action.onClick(event, props.data)} color="primary" variant="contained">
                  {action.tooltip}
                </Button>
              ),
              'Bulk Delete': (
                <Button className="ml-2" size="large" startIcon={<DeleteIcon />} onClick={(event) => props.action.onClick(event, props.data)} color="primary" variant="contained">
                  {action.tooltip}
                </Button>
              ),
              Save: (
                <Tooltip title={action.tooltip}>
                  <IconButton
                    aria-label="save"
                    onClick={(event) => props.action.onClick(event, props.data)}
                    size="large">
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
              ),
              Cancel: (
                <Tooltip title={action.tooltip}>
                  <IconButton
                    aria-label="cancel"
                    onClick={(event) => props.action.onClick(event, props.data)}
                    size="large">
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              ),
              Delete: (
                <Tooltip title={action.tooltip}>
                  <IconButton
                    aria-label="cancel"
                    onClick={(event) => props.action.onClick(event, props.data)}
                    size="large">
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              ),
            }[action.tooltip]
          }
        </Fragment>
      )}
    </Fragment>
  );
};

export default MaterialTableCustomButtonRenderer;
