import { reverse } from 'named-urls';

import { renderWithRedux, screen, waitFor, testMemoryHistory, logRoles, prettyDOM, within } from '../../../__test__/rtl/test-utils';
import AppRoutes from '.';
import routes from '../../constants/routes';
import visitorAuthState from '../../../__test__/rtl/fixtures/visitorAuthState.json';

describe('AppRoutes component', () => {
  beforeEach(() => {
    testMemoryHistory.push(routes.public.home);
  });

  test('Non-authenticated user should be able to navigate to a public page', async () => {
    const publicRoute = routes.public.onboarding;

    renderWithRedux(<AppRoutes />);

    testMemoryHistory.push(publicRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(publicRoute);
    });
  });

  test('Authenticated user should be able to navigate to a protected dashboard page', async () => {
    const protectedRoute = routes.dashboard.home;

    renderWithRedux(<AppRoutes />, {
      preloadedState: {
        auth: {
          authenticatedUserObject: {
            email: 'testuser@gmail.com',
            firstName: 'John',
            lastName: 'Officer',
          },
          isAuthenticated: true,
        },
      },
    });

    testMemoryHistory.push(protectedRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/dashboard');
    });
  });

  test('Non-authenticated user should be able to navigate to a public auth page', async () => {
    const publicAuthRoute = reverse(routes.authentication.registration, { token: 1234 });

    renderWithRedux(<AppRoutes />);

    testMemoryHistory.push(publicAuthRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(publicAuthRoute);
    });
  });

  test('Non-authenticated user should be redirected to /login immediately when trying to navigate to a protected page', async () => {
    const loginRoute = routes.public.login;
    const protectedRoute = routes.dashboard.home;

    renderWithRedux(<AppRoutes />);

    testMemoryHistory.push(protectedRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(loginRoute);
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  test('Authenticated user whose MFA has been activated should be redirected to /authentication/otp immediately if MFA is not verified when trying to navigate to a protected page', async () => {
    const authOtpRoute = routes.authentication.otp;

    renderWithRedux(<AppRoutes />, {
      preloadedState: {
        auth: {
          authenticatedUserObject: {
            email: 'testuser@gmail.com',
            firstName: 'John',
            isMFACodeVerified: false,
            lastName: 'Officer',
            MFAActive: true,
            MFAEnabled: true,
          },
          isAuthenticated: true,
        },
      },
    });

    testMemoryHistory.push(routes.dashboard.home);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(authOtpRoute);
    });
  });

  test('Authenticated user should be able to see only home and administration nav links if not KYC compliant in the dashboard sidebar', async () => {
    const dashboardHomeRoute = routes.dashboard.home;

    renderWithRedux(<AppRoutes />, {
      preloadedState: visitorAuthState,
    });

    testMemoryHistory.push(dashboardHomeRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(dashboardHomeRoute);
      const dashboardSidebar = screen.getByTestId('dashboard-sidebar');
      expect(dashboardSidebar).toBeInTheDocument();
      const navLinks = within(dashboardSidebar).getAllByRole('button');
      expect(navLinks).toHaveLength(2);

      ['Home', 'Administration'].forEach((item, index) => expect(navLinks[index]).toHaveTextContent(item));
    });
  });

  test('Authenticated user should be redirected to Page Not Found page if not KYC compliant when trying to access a route that requires kyc approval', async () => {
    const issuancesHomeRoute = routes.dashboard.issuances.home;

    renderWithRedux(<AppRoutes />, {
      preloadedState: visitorAuthState,
    });

    testMemoryHistory.push(issuancesHomeRoute);

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(issuancesHomeRoute);
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  test('User should be redirected to Page Not Found page when trying to navigate to a nonexistent page', async () => {
    const nonexistentRoute = '/sleep-is-the-little-death';

    renderWithRedux(<AppRoutes />);

    testMemoryHistory.push(nonexistentRoute);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });
});
