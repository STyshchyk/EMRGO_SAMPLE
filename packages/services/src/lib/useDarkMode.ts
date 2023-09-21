import { queryKeys } from "@emrgo-frontend/constants";
import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchProfileSettings, postProfileSettings } from "./profile";

export function useDarkModeCustom(): [
  isDarkMode: boolean,
  enable: () => void,
  disable: () => void,
  toggle: () => void
] {
  const { data: isDarkMode, refetch: refetchProfile } = useQuery([queryKeys.profileSettings], {
    staleTime: Infinity,
    queryFn: () => fetchProfileSettings({ keys: ["dark-mode-settings"] }),
    select: (selectedData) => {
      if (Array.isArray(selectedData) && selectedData[0]?.value)
        return selectedData[0].value === "true";
      return false;
    },
  });

  const { mutate: postSettings } = useMutation({
    mutationFn: postProfileSettings,
    onSuccess: () => {
      refetchProfile();
    },
  });
  const enable = () => {
    postSettings({
      settings: [
        {
          key: "dark-mode-settings",
          value: JSON.stringify(true),
          isActive: true,
        },
      ],
    });
  };
  const disable = () => {
    postSettings({
      settings: [
        {
          key: "dark-mode-settings",
          value: JSON.stringify(false),
          isActive: true,
        },
      ],
    });
  };
  const toggle = () => {
    if (isDarkMode) disable();
    else enable();
  };

  return [isDarkMode, enable, disable, toggle];
}
