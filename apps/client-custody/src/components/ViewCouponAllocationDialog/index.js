import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CouponEventDetails from '../CouponEventDetails';
import CouponAllocationsTable, { generateCouponAllocationTableRowData } from '../CouponAllocationsTable';
import CustomNumberInputField from '../CustomNumberInputField';
import StyledDialogHeader from '../StyledDialogHeader';

const ViewCouponAllocationDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const [totalCouponAmount, setTotalCouponAmount] = useState(0);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (currentlySelectedRowData?.totalCouponAmount) {
      const parsedTotalCouponAmount = parseFloat(currentlySelectedRowData?.totalCouponAmount, 10);

      setTotalCouponAmount(parsedTotalCouponAmount);
    }

    if (Array.isArray(currentlySelectedRowData?.investors) && currentlySelectedRowData?.investors.length > 0) {
      const updatedTableData = currentlySelectedRowData?.investors.map((i) => generateCouponAllocationTableRowData(i));

      setTableData(updatedTableData);
    }

    return () => {
      setTableData([]);
      setTotalCouponAmount(0);
    };
  }, [currentlySelectedRowData?.investors, currentlySelectedRowData?.totalCouponAmount, totalCouponAmount]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;

        handleClose();
      }}
      aria-labelledby="view-coupon-allocation-dialog"
    >
      <StyledDialogHeader title="View Coupon Allocation" handleClose={handleClose} />

      <DialogContent>
        <Box mb={2}>
          <CouponEventDetails couponEventData={currentlySelectedRowData} />
          <hr />
          <Grid container spacing={2}>
            <Grid item md={12} container alignItems="center" spacing={2} justifyContent="space-between">
              <Grid item>
                <Typography>Total Coupon Amt.</Typography>
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  fullWidth
                  variant="filled"
                  value={totalCouponAmount}
                  InputProps={{
                    inputComponent: CustomNumberInputField,

                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: '0.75em',
                            padding: '0 1rem',
                          }}
                        >
                          {currentlySelectedRowData?.externalSecurity?.currencyName?.name}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item md={12}>
              <CouponAllocationsTable isLoading={false} tableData={tableData} setTableData={setTableData} />
            </Grid>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            justifyContent="flex-end"
            style={{
              marginTop: '1rem',
            }}
          >
            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  handleClose();
                }}
              >
                <strong>Close</strong>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCouponAllocationDialog;
