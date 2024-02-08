import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IDeleteGroupProps, TWrapperType } from "@emrgo-frontend/types";
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

export const useDeleteMesssages = (queryKey: string[], userType: TWrapperType | null) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, wrapper }: IDeleteGroupProps) => {
      if (!queryKey || !userType || !id || !wrapper) return Promise.reject();
      const req = await SecureMessagesApi.deleteMessage({ id: id, wrapper: wrapper });
    },
    onSuccess: () => {
      client.invalidateQueries(queryKey).then(() => {
        console.log("success delete");
      });
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
