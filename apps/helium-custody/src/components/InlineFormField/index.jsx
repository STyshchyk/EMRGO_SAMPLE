import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const InlineFormField = ({ label, children }) => (
  <Grid item container md={12}>
    <Grid item md={5} xs={12} container direction="column" justifyContent="center">
      <Typography>{label}</Typography>
    </Grid>
    <Grid item md={7} xs={12}>
      <FormControl
        style={{
          width: "100%",
        }}
      >
        {children}
      </FormControl>
    </Grid>
  </Grid>
);

export default InlineFormField;
