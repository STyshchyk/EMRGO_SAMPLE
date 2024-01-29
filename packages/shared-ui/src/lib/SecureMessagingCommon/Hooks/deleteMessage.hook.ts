import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteGroup = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: SecureMessagesApi.deleteGroup,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.secureMessaging.fetch] }).then(() => {});
      console.log("success");
    },
    onError: () => {
      console.log("error deleting message");
    },
  });
};

export const useDeleteMesssages = (queryKey: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: SecureMessagesApi.deleteMessage,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKey] }).then(() => {});
      console.log("success");
    },
    onError: () => {
      console.log("error deleting message");
    },
  });
};

export const useUpdateMessageFlag = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: SecureMessagesApi.updateFlag,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.secureMessaging.fetch] }).then(() => {});
      console.log("success");
    },
    onError: () => {
      console.log("error deleting message");
    },
  });
};
