import { useState } from "react";
import { useTranslation } from "react-i18next";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Field } from "formik";
import { TextField } from "formik-mui";

const CalculationField = ({
  fieldLabel,
  fieldKey,
  handleOnBlur,
  touched,
  values,
  handleFieldReset,
}) => {
  const { t } = useTranslation(["fx_transactions"]);
  const [isHovered, setIsHovered] = useState(false);
  const isTouched = touched[fieldKey];
  const fieldValue = values[fieldKey];
  return (
    <Grid container className="mt-4">
      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
        <Typography className="mt-4">{fieldLabel}</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
        <Field
          fullWidth
          min="0"
          component={TextField}
          name={fieldKey}
          // type="number"
          variant="filled"
          value={fieldValue}
          onBlur={(e) => handleOnBlur(e, fieldKey)}
          inputProps={{
            min: 0,
          }}
          onKeyPress={(e) => {
            if (e.which === 13) {
              e.preventDefault();
            }
          }}
          InputProps={{
            endAdornment: isTouched && (
              <InputAdornment position="end">
                <Tooltip
                  placement="left"
                  title={t("fx_transactions:Fx Modal.Buttons.Reset User Input")}
                >
                  <IconButton
                    aria-label="reset"
                    size="small"
                    color="primary"
                    onClick={() => handleFieldReset(fieldKey)}
                    onMouseEnter={() => {
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                      setIsHovered(false);
                    }}
                  >
                    {isHovered ? <LockOpenIcon size="small" /> : <LockOutlinedIcon size="small" />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText={
            isTouched
              ? t("fx_transactions:Fx Modal.Value has been edited, changes are locked")
              : undefined
          }
        />
      </Grid>
    </Grid>
  );
};

export default CalculationField;
