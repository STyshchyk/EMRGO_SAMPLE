import { FC } from "react";

import { DashboardContent, SearchInput, Select } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { BankPanel } from "../../components/BankPanel";
import { AboutUs } from "./AboutUs";
import { Banner } from "./Banner";
import { DownloadButton } from "./DownloadButton";
import { useTradeOpportunitiesContext } from "./TradeOpportunities.provider";
import * as Styles from "./TradeOpportunities.styles";
import { ITradeOpportunitiesProps } from "./TradeOpportunities.types";

export const TradeOpportunitiesComponent: FC<ITradeOpportunitiesProps> = (
  props: ITradeOpportunitiesProps
) => {
  const {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    downloadData,
    investmentBanks,
    searchQuery,
    setSearchQuery,
    filterType,
    selectProductType,
    filterStatus,
    selectProductStatus,
    productTypes,
    productStatus,
  } = ensureNotNull(useTradeOpportunitiesContext());

  return (
    <DashboardContent>
      <Styles.Banners>
        <Banner />
        {isAboutUsDisplayed && <AboutUs onClose={() => setIsAboutUsDisplayed(false)} />}
      </Styles.Banners>

      <Styles.Actions>
        <SearchInput
          value={searchQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(event.target.value)
          }
        />
        <Select
          options={productTypes || []}
          defaultValue={productTypes ? productTypes[0] : undefined}
          value={filterType ? filterType : productTypes ? productTypes[0] : undefined}
          onChange={(selected: any) => {
            selectProductType(selected);
          }}
        />
        <Select
          options={productStatus || []}
          value={filterStatus ? filterStatus : productStatus ? productStatus[0] : undefined}
          onChange={(selected: any) => {
            selectProductStatus(selected);
          }}
        />
        <DownloadButton onClick={downloadData} />
      </Styles.Actions>

      {investmentBanks?.map((bank) => (
        <BankPanel key={bank.bankId} bank={bank} />
      ))}

      {/* {data.map((bank) => (
        <BankPanelLegacy key={bank.id} bank={bank} />
      ))} */}
    </DashboardContent>
  );
};
