"use client";

import React from "react";
import { User as PrismaUser, Invite as PrismaInvite } from "@prisma/client";
import { createContext, useEffect, useState } from "react";

export type UserNotifyContextType =
  | ({
      invite: PrismaInvite[];
    } & PrismaUser)
  | null;

type notificationContextType = {
  notification: any;
  setNotifyInvites: (invites: number) => void;
  setNotifyOptions: (options: any) => void;
  setNotifyState: (state: boolean) => void;
};

const notificationContextDefault: notificationContextType = {
  notification: null,
  setNotifyInvites: () => {},
  setNotifyOptions: () => {},
  setNotifyState: () => {},
};

export const NotificationContext = createContext<notificationContextType>(
  notificationContextDefault
);

export const NotificationUpdate = (
  appUser: UserNotifyContextType,
  setUnseen: (invites: number) => void,
  setInvites: (invites: PrismaInvite[]) => void
) => {
  const { unseenInvites, invite } = appUser || {};

  useEffect(() => {
    if (unseenInvites) {
      setUnseen(unseenInvites);
    }
    if (invite) {
      setInvites(invite);
    }
  }, []);
};

type NotificationType = {
  visible: boolean;
  new: number;
  options: any[] | any;
};

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const init = {
    visible: false,
    new: 0,
    options: [],
  };

  const [notification, setNotification] = useState<NotificationType>(init);

  function setNotifyInvites(invites: any) {
    setNotification((current: any) => ({
      ...current,
      new: invites,
    }));
  }

  function setNotifyOptions(options: any) {
    setNotification((current) => ({
      ...current,
      options: options,
    }));
  }

  function setNotifyState(state: boolean) {
    setNotification((current) => ({
      ...current,
      visible: state,
    }));
  }

  const value = {
    notification,
    setNotifyInvites,
    setNotifyOptions,
    setNotifyState,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
