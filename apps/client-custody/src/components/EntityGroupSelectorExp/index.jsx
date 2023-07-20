import { Fragment, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

import routes from "../../constants/routes";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as authSelectors from "../../redux/selectors/auth";
import selectStyles from "../../styles/cssInJs/reactSelect";

const getEntityGroupOption = (entityGroupName, entityGroupOptions) =>
  entityGroupOptions.find(({ name }) => entityGroupName === name);

const EntityGroupSelector = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  let currentEntityGroupIndex = useSelector(authSelectors.selectCurrentEntityGroupIndex);
  currentEntityGroupIndex = currentEntityGroup ? currentEntityGroupIndex : 0;
  const ownEntityGroupNames = useSelector(authSelectors.selectOwnEntityGroupNames);
  const numberOfOwnEntityGroups = ownEntityGroupNames.length;
  const entityGroupsDropdown = ownEntityGroupNames.map((entityGroup, index) => ({
    value: index,
    label: entityGroup.name,
    meta: entityGroup,
  }));
  const [entityGroupIndex, setEntityGroupIndex] = useState(
    currentEntityGroupIndex > numberOfOwnEntityGroups ? 0 : currentEntityGroupIndex
  );
  useLayoutEffect(() => {
    const updateEntityGroupIndex = (payload) =>
      dispatch(authActionCreators.doUpdateEntityGroupIndex(payload));

    updateEntityGroupIndex({
      index: entityGroupIndex,
    });

    // !Dev note: Dashboard header is always rendered whenever user navigates to a different page (Unintended side-effect!)
    // !Dev note: This push call will be executed only if user actually switches to a different EG
    if (currentEntityGroupIndex !== entityGroupIndex) {
      navigate(routes.dashboard.home);
    }
  }, [currentEntityGroupIndex, dispatch, entityGroupIndex, history]);

  const handleEntityGroupMenuSelect = (entityGroupName) => {
    const current = getEntityGroupOption(entityGroupName, ownEntityGroupNames);

    const newIndex = current?.index;

    setEntityGroupIndex(newIndex);
  };

  return (
    <Box mt={2} mb={4} className={`${entityGroupsDropdown.length === 1 ? "hidden" : "block"}`}>
      <Typography align="center" className="my-4">
        {t("auth:Please select the role you would like to use on Emrgo")}
      </Typography>
      <FormControl className="w-full">
        <Select
          closeMenuOnSelect
          placeholder={t("auth:Select Role")}
          isSearchable
          styles={selectStyles}
          menuPortalTarget={document.body}
          value={entityGroupsDropdown[entityGroupIndex]}
          options={entityGroupsDropdown}
          onChange={(selectedEntityGroup) => {
            handleEntityGroupMenuSelect(selectedEntityGroup.label);
          }}
        />
      </FormControl>
      {/* <Menu
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
      </Menu> */}
    </Box>
  );
};

export default EntityGroupSelector;
