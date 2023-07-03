import { Toaster } from "react-hot-toast";

import { IToastProviderProps } from "./Toast.types";

export const ToastProvider = (props: IToastProviderProps) => {
  return <Toaster position="bottom-center" {...props} />;
};
