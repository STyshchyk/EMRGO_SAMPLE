import { FC } from "react";

import { DashboardContent } from "@emrgo-frontend/shared-ui";
import { OnboardedUsers } from "./OnboarderUsers";

import * as Styles from "./OnboardingUser.styles";
import { IOnboardingUserProps } from "./OnboardingUser.types";

export const OnboardingUserComponent: FC<IOnboardingUserProps> = ({}: IOnboardingUserProps) => {
  return (
    <Styles.OnboardingUser>
      <DashboardContent>
        {/*<Styles.Banners>*/}
        {/*  <Banner />*/}
        {/*  {isAboutUsDisplayed && <AboutUs onClose={() => setIsAboutUsDisplayed(false)} />}*/}
        {/*</Styles.Banners>*/}
        {/*<Styles.Actions>*/}
        {/*  <SearchInput value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />*/}
        {/*  <Dropdown items={filterTypes2} value={filterType} onChange={setFilterType} />*/}
        {/*  <Dropdown items={filterStatuses2} value={filterStatus} onChange={setFilterStatus} />*/}
        {/*  <DownloadButton onClick={downloadData} />*/}
        {/*</Styles.Actions>*/}
        <OnboardedUsers />
      </DashboardContent>
    </Styles.OnboardingUser>
  );
};
