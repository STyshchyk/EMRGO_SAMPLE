import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const NotFound = () => (
  <Grid
    container
    direction="column"
    alignItems="center"
    data-testid="not-found-page"
    justifyContent="center"
    spacing={2}
    style={{
      minHeight: '80vh',
    }}
  >
    <Grid item>
      <Typography
        variant="h2"
        style={{
          fontWeight: 'bold',
        }}
      >
        Page not found
      </Typography>
    </Grid>
    <Grid item>
      <RouterLink to="/" component={Link}>
        Go to the homepage
      </RouterLink>
    </Grid>
  </Grid>
);

export default NotFound;
