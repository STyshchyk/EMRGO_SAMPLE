import { testMemoryHistory } from "../../../__test__/rtl/test-utils";
// import Login from '.';
import routes from "../../constants/routes";

describe("Login page component", () => {
  beforeEach(() => {
    testMemoryHistory.push(routes.public.home);
  });

  test.todo("Test user authentication flow with MSW when MFA is not activated");
  test.todo("Test user authentication flow with MSW when MFA is enabled");
  test.todo("Test login form validation");
});
