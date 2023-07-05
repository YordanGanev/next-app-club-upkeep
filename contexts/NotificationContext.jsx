"use client";

import { createContext, useEffect, useState } from "react";

export const NotificationContext = createContext(null);

export const NotificationUpdate = (
  // { unseenInvites, invite },
  appUser,
  setUnseen,
  setInvites
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

function NotificationProvider({ children }) {
  const init = {
    visible: false,
    new: 0,
    options: [],
  };

  const [notification, setNotification] = useState(init);

  function setNotifyInvites(invites) {
    setNotification((current) => ({
      ...current,
      new: invites,
    }));
  }

  function setNotifyOptions(options) {
    setNotification((current) => ({
      ...current,
      options: options,
    }));
  }

  function setNotifyState(state) {
    setNotification((current) => ({
      ...current,
      visible: state,
    }));
  }

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotifyInvites,
        setNotifyOptions,
        setNotifyState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
