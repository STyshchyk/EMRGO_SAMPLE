import { useState, useLayoutEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import shortid from 'shortid';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useHistory } from 'react-router-dom';

import * as authActionCreators from '../../redux/actionCreators/auth';
import * as authSelectors from '../../redux/selectors/auth';
import routes from '../../constants/routes';

const getEntityGroupOption = (entityGroupName, entityGroupOptions) => entityGroupOptions.find(({ name }) => entityGroupName === name);

const EntityGroupSelector = () => {
  const dispatch = useDispatch();
  const [entityGroupMenu, setEntityGroupMenu] = useState(null);
  const history = useHistory();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupIndex = useSelector(authSelectors.selectCurrentEntityGroupIndex);
  const ownEntityGroupNames = useSelector(authSelectors.selectOwnEntityGroupNames);
  const numberOfOwnEntityGroups = ownEntityGroupNames.length;
  const [entityGroupIndex, setEntityGroupIndex] = useState(currentEntityGroupIndex > numberOfOwnEntityGroups ? 0 : currentEntityGroupIndex);
  useLayoutEffect(() => {
    const updateEntityGroupIndex = (payload) => dispatch(authActionCreators.doUpdateEntityGroupIndex(payload));

    updateEntityGroupIndex({
      index: entityGroupIndex,
    });

    // !Dev note: Dashboard header is always rendered whenever user navigates to a different page (Unintended side-effect!)
    // !Dev note: This push call will be executed only if user actually switches to a different EG
    if (currentEntityGroupIndex !== entityGroupIndex) {
      history.push(routes.dashboard.home);
    }
  }, [currentEntityGroupIndex, dispatch, entityGroupIndex, history]);

  const handleSwitchIconClick = (event) => {
    setEntityGroupMenu(event.currentTarget);
  };

  const handleEntityGroupMenuClose = (event) => {
    if (event.currentTarget.nodeName === 'A') {
      const current = getEntityGroupOption(event?.currentTarget?.name, ownEntityGroupNames);

      const newIndex = current?.index;

      setEntityGroupIndex(newIndex);
    }

    setEntityGroupMenu(null);
  };

  return (
    <Fragment>
      <Tooltip title={currentEntityGroup?.name} enterDelay={300} data-testid="entity-group-selector">
        <Button color="inherit" onClick={handleSwitchIconClick}>
          <SwapHorizIcon />
        </Button>
      </Tooltip>
      <Menu
        id="entity-group-menu"
        anchorEl={entityGroupMenu}
        open={Boolean(entityGroupMenu)}
        onClose={handleEntityGroupMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
      >
        {ownEntityGroupNames.map((i, currentIndex) => (
          <MenuItem
            name={i.name}
            component="a"
            data-no-link="true"
            disabled={currentIndex === currentEntityGroupIndex}
            selected={currentIndex === currentEntityGroupIndex}
            key={shortid.generate()}
            onClick={handleEntityGroupMenuClose}
          >
            <Typography style={{ fontWeight: 'bold' }} variant="body2">{`${i.name} (${i.type})`}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
export default EntityGroupSelector;
