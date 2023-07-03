import { toast } from "react-hot-toast";

import { Toast } from "./Toast";
import { TToastVariants } from "./Toast.types";
import { Transition } from "./Transition";

const showToast = (variant: TToastVariants, message: string) => {
  return toast.custom(({ id, visible }) => {
    return (
      <Transition isVisible={visible}>
        <Toast variant={variant} onClose={() => toast.dismiss(id)}>
          {message}
        </Toast>
      </Transition>
    );
  });
};

const showSuccessToast = (message: string) => showToast("success", message);
const showInfoToast = (message: string) => showToast("info", message);
const showErrorToast = (message: string) => showToast("error", message);
const showWarningToast = (message: string) => showToast("warning", message);

export const useToast = () => {
  return { showSuccessToast, showInfoToast, showErrorToast, showWarningToast };
};
