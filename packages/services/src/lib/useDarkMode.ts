import { queryKeys } from "@emrgo-frontend/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDarkMode } from "usehooks-ts";

import { fetchProfileSettings, postProfileSettings } from "./profile";

export function useDarkModeCustom(): [boolean, () => void, () => void, () => void, boolean] {
  const { enable: enableDark, disable: disableDark } = useDarkMode();

  const {
    data: isDarkModeCustom,
    refetch: refetchProfile,
    isFetching,
  } = useQuery([queryKeys.profileSettings], {
    staleTime: Infinity,
    keepPreviousData: false,
    cacheTime: Infinity,
    queryFn: () => fetchProfileSettings({ keys: ["dark-mode-settings"] }),
    onSuccess: (value) => {
      if (value) enableDark();
      else disableDark();
    },
    select: (selectedData) => {
      const value = selectedData[0]?.value === "true";
      return value;
    },
  });

  // useEffect(() => {
  //   //Fire useHooks to write in a local storage current theme value
  //   if (!isFetching && !isDarkModeCustom) {
  //     console.log(isFetching, isDarkModeCustom);
  //     if (isDarkModeCustom) enableDark();
  //     else disableDark();
  //   }
  // }, []);

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
    enableDark();
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
    disableDark();
  };
  const toggle = () => {
    if (isDarkModeCustom) disable();
    else enable();
  };

  return [isDarkModeCustom, enable, disable, toggle, isFetching];
}
