import React, { createContext, PropsWithChildren, useContext } from "react";

import { ISilverSecureMessagingContext } from "./SilverSecureMessaging.types";

const SilverSecureMessagingContext = createContext<ISilverSecureMessagingContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the SilverSecureMessaging template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */

const list = [
  {
    id: "1asd131",
    enityName: "Tara Pavls",
    subject: "Password reset",
    date: new Date(),
    isSelected: false,
    isRead: false,
  },
  {
    id: "2asdasf14fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14fa3s",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
    isRead: false,
  },
  {
    id: "2asdasf14f4as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f5as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f6as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf147fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf148fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f34as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
];
export const SilverSecureMessagingProvider = ({ children }: PropsWithChildren) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [isCheckModeSelected, setCheckMode] = React.useState(false);
  const state: ISilverSecureMessagingContext = {
    messagesList: list,
    checked,
    isCheckModeSelected,
    setCheckMode,
    setChecked,
  };
  return (
    <SilverSecureMessagingContext.Provider value={state}>
      {children}
    </SilverSecureMessagingContext.Provider>
  );
};

export const useSilverSecureMessagingContext = () => useContext(SilverSecureMessagingContext);
