import Typography from "@mui/material/Typography";

const StyledPageTitle = ({ title }) => (
  <Typography>
    <span
      style={{
        borderBottom: "2px solid #28ccbf",
        fontSize: "1rem",
        fontWeight: "bold",
        paddingBottom: "0.25em",
      }}
    >
      {title}
    </span>
  </Typography>
);

export default StyledPageTitle;
