import { Fragment, useState } from "react";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import Select from "react-select";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
// import PropTypes from 'prop-types';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
const PREFIX = 'ViewSSIDialog';

const classes = {
  tab: `${PREFIX}-tab`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.tab}`]: {
    fontWeight: "bold",
    marginRight: theme.spacing(2),
    minWidth: "auto",
    padding: 0,
    textTransform: "none",
  }
}));

// * TODO: DRY UP DIALOG UI CODES

const customSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 100,
  }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
};

const a11yProps = (index) => ({
  id: `ssi-tab-${index}`,
  "aria-controls": `ssi-tabpanel-${index}`,
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const SSIDetailsView = ({ ssiDetails }) => (
  <Root>
    {Object.entries(ssiDetails ?? []).map(([, item]) => (
      <Grid container>
        <Grid item md={6}>
          <Typography>{item.label}</Typography>
        </Grid>
        <Grid item md={6}>
          <Typography>{item.value}</Typography>
        </Grid>
      </Grid>
    ))}
  </Root>
);

const HARDCODED_WETHAQ_SSI_DATA = {
  accountName: {
    label: "Account Name",
    value: "Wethaq Capital Markets Client Account",
  },
  swiftBIC: {
    label: "SWIFT BIC",
    value: "EBILAEAD",
  },
  iban: {
    label: "IBAN",
    value: "AE390260001011152401401",
  },
};

const generateSSIDetails = (selectedPaymentAccount) => ({
  accountName: {
    label: "Account Name",
    value: selectedPaymentAccount?.name ?? "--",
  },
  label: {
    label: "Label",
    value: selectedPaymentAccount?.label ?? "--",
  },
  iban: {
    label: "IBAN",
    value: selectedPaymentAccount?.iban ?? "--",
  },
  swift: {
    label: "SWIFT",
    value: selectedPaymentAccount?.swift ?? "--",
  },
  bankName: {
    label: "Bank Name",
    value: selectedPaymentAccount?.bankName ?? "--",
  },
  sortCode: {
    label: "Sort Code",
    value: selectedPaymentAccount?.sortCode ?? "--",
  },

  ifscCode: {
    label: "IFSC Code",
    value: selectedPaymentAccount?.ifscCode ?? "--",
  },
  country: {
    label: "Country",
    value: selectedPaymentAccount?.country?.name ?? "--",
  },
  currency: {
    label: "Currency",
    value: selectedPaymentAccount?.currency?.name ?? "--",
  },
});

const EditableUI = ({ paymentAccounts, open, handleClose }) => {
  const { t } = useTranslation(["reports"]);
  const [value, setValue] = useState(0);
  const [currentlySelectedPaymentAccountOption, setCurrentlySelectedPaymentAccountOption] =
    useState(null);
  const [selectedPaymentAccountDetails, setSelectedPaymentAccountDetails] = useState({});



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const paymentAccountOptionsList = paymentAccounts.map((paymentAccount, index) => ({
    label: `${paymentAccount.name} (${paymentAccount.label}) (${paymentAccount.currency?.name})`,
    value: index,
  }));

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              indicatorColor="primary"
            >
              <Tab
                classes={{ root: classes.tab, disabled: classes.disabled }}
                disableRipple
                label="Your SSI"
                {...a11yProps(0)}
              />
              <Tab
                classes={{ root: classes.tab, disabled: classes.disabled }}
                disableRipple
                label="Wethaq SSI"
                {...a11yProps(1)}
              />
            </Tabs>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        style={{
          height: "50vh",
        }}
      >
        <TabPanel value={value} index={0}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography style={{ fontWeight: "bold" }}>Select Preferred Account</Typography>
            </Grid>
            <Grid item xs={6}>
              <Select
                styles={customSelectStyles}
                closeMenuOnSelect
                options={paymentAccountOptionsList}
                value={currentlySelectedPaymentAccountOption}
                onChange={(newValue) => {
                  setCurrentlySelectedPaymentAccountOption(newValue);
                  setSelectedPaymentAccountDetails(paymentAccounts[newValue.value]);
                }}
              />
            </Grid>
            <Grid container item>
              <SSIDetailsView ssiDetails={generateSSIDetails(selectedPaymentAccountDetails)} />
            </Grid>

            <Grid item>
              <Button color="primary" variant="outlined">
                Modify Banking Details
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <SSIDetailsView ssiDetails={HARDCODED_WETHAQ_SSI_DATA} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

const OperationsUI = ({ selectedRowData, open, handleClose }) => {
  const { t } = useTranslation(["reports"]);
  const [value, setValue] = useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              indicatorColor="primary"
            >
              <Tab
                classes={{ root: classes.tab, disabled: classes.disabled }}
                disableRipple
                label="Investor SSI"
                {...a11yProps(0)}
              />
              <Tab
                classes={{ root: classes.tab, disabled: classes.disabled }}
                disableRipple
                label="Wethaq SSI"
                {...a11yProps(1)}
              />
            </Tabs>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        style={{
          height: "50vh",
        }}
      >
        <TabPanel value={value} index={0}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography
                style={{ fontWeight: "bold" }}
              >{`${selectedRowData?.investor}`}</Typography>
            </Grid>

            <Grid container item>
              <SSIDetailsView ssiDetails={generateSSIDetails([])} />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <SSIDetailsView ssiDetails={HARDCODED_WETHAQ_SSI_DATA} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};
const ViewSSIDialog = ({
  paymentAccounts,
  open,
  handleClose,
  operationsMode,
  currentlySelectedRowData,
}) => (
  <Fragment>
    {operationsMode ? (
      <OperationsUI
        selectedRowData={currentlySelectedRowData}
        open={open}
        handleClose={handleClose}
      />
    ) : (
      <EditableUI paymentAccounts={paymentAccounts} open={open} handleClose={handleClose} />
    )}
  </Fragment>
);

export default ViewSSIDialog;

ViewSSIDialog.defaultProps = {
  operationsMode: false,
};
