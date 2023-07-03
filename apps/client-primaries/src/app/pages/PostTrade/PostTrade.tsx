import { FC } from "react";

import { PrimariesWrapper } from "../../components/PrimariesWrapper/PrimariesWrapper";
import { PostTradeComponent } from "./PostTrade.component";
import { PostTradeProvider } from "./PostTrade.provider";
import { IPostTradeProps } from "./PostTrade.types";

export const PostTrade: FC<IPostTradeProps> = (props: IPostTradeProps) => {
  return (
    <PrimariesWrapper>
      <PostTradeProvider>
        <PostTradeComponent />
      </PostTradeProvider>
    </PrimariesWrapper>
  );
};
