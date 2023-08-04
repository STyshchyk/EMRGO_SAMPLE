import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import FormControl from "@mui/material/FormControl";
// import cx from 'classnames';

import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import PropTypes from "prop-types";

import { selectCurrentEntityGroup } from "../../redux/selectors/auth";
import selectStyles from "../../styles/cssInJs/reactSelect";

const animatedComponents = makeAnimated();

const ChangeRequest = ({ setFieldValue, changeRequests, fieldKey }) => {
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);
  const entityType = currentEntityGroup?.entityType;
  const changeRequest = changeRequests[fieldKey] || "";

  const options = [
    { value: "updateDetails", label: t("Miscellaneous.Update Details") },
    { value: "required", label: t("Miscellaneous.Required") },
    { value: "provideSupportingDocs", label: t("Miscellaneous.Provide Supporting Docs") },
  ];

  const selectedChange = options.find((request) => request.value === changeRequest);
  return (
    <Fragment>
      {entityType === "EMRGO_SERVICES" ? (
        <FormControl className="w-full">
          <Select
            closeMenuOnSelect
            isSearchable
            isClearable
            placeholder={`${t("components:Select.Select")}...`}
            components={{
              ...animatedComponents,
            }}
            styles={selectStyles}
            value={selectedChange}
            options={options}
            onChange={(selected) => {
              if (selected === null) {
                const tempRequests = { ...changeRequests };
                delete tempRequests[fieldKey];
                setFieldValue(`changeRequests`, tempRequests);
              } else {
                setFieldValue(`changeRequests.${fieldKey}`, selected.value);
              }
            }}
          />
        </FormControl>
      ) : (
        <Fragment>
          {changeRequest !== null && changeRequest !== undefined ? (
            <Typography align="right" className="text-yellow-500 mt-4">
              {capitalCase(changeRequest)}
            </Typography>
          ) : (
            ""
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

ChangeRequest.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  changeRequests: PropTypes.object.isRequired,
  fieldKey: PropTypes.string.isRequired,
};

export default ChangeRequest;
