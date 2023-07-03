import { FC } from "react";

import { PostTradeComponent } from "./PostTrade.component";
import { PostTradeProvider } from "./PostTrade.provider";
import { IPostTradeProps } from "./PostTrade.types";

export const PostTrade: FC<IPostTradeProps> = ({}: IPostTradeProps) => {
  return (
    <PostTradeProvider>
      <PostTradeComponent />
    </PostTradeProvider>
  );
};
