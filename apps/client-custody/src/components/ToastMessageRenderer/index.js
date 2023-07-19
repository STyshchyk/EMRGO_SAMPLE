import { Fragment } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

const ToastMessageRenderer = ({ groupedMessages }) => (
  <Box>
    <List dense>
      <Fragment>
        {groupedMessages.map((group, index) => (
          <Fragment>
            <ListSubheader disableSticky className="text-xs text-left text-gray-500 pt-4">
              {group.name}
            </ListSubheader>
            {group.messages.map((message) => (
              <Fragment>
                <ListItem>
                  <ListItemIcon>{message.icon}</ListItemIcon>
                  <ListItemText primary={message.text} secondary={null} className="text-xl text-left  text-gray-700" />
                </ListItem>
              </Fragment>
            ))}
            {index !== groupedMessages.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </Fragment>
    </List>
  </Box>
);

export default ToastMessageRenderer;
