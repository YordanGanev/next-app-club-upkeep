"use client";

import { createContext, useEffect, useState } from "react";

type PopoutContextType = {
  actionVisible: boolean | null;
  actionState: ConfirmActionType | null;
  actionAccept: () => void;
  actionDecline: () => void;
  setAction: (action: ConfirmActionType) => void;
  filterOpts: PopoutBackgroundType;
  setFilterOpts: (opts: PopoutBackgroundType) => void;
  profileMenuState: boolean;
  setProfileMenuState: (state: boolean) => void;
};

type PopoutBackgroundType = {
  blockClick: boolean;
  blur: boolean;
  darken: boolean;
};

type ConfirmActionType = {
  // visible: boolean | null;
  title: string;
  message: string;
  callback: () => void;
};

type InputType = {
  type: string;
  name: string;
  value: any | null;
  key: string | null;
  label: string | null;
  placeholder: string | null;
  onChange: ((e: any) => void) | null;
  required: boolean | null;
  disabled: boolean | null;
  format: string | null;
  options: any[] | null;
  handleChange: ((e: any) => void) | null;
};

// type FormType = {
//   visible: boolean;
//   title: string;
// };

const confirmActionDefault = {
  visible: false,
  title: "Confirm Action",
  message: "Confirm action",
  callback: () => {},
};

const windowFilterDefault = {
  blockClick: false,
  blur: false,
  darken: false,
};

const PopoutContextDefault = {
  actionVisible: false,
  actionState: confirmActionDefault,
  actionAccept: () => {},
  actionDecline: () => {},
  setAction: () => {},
  filterOpts: windowFilterDefault,
  setFilterOpts: () => {},
  profileMenuState: false,
  setProfileMenuState: () => {},
};

export const PopoutContext =
  createContext<PopoutContextType>(PopoutContextDefault);

function PopoutContextProvider({ children }: { children: React.ReactNode }) {
  const [actionState, setActionState] =
    useState<ConfirmActionType>(confirmActionDefault);

  const [actionVisible, setActionVisible] = useState<boolean>(false);

  const [filterOpts, setFilterOpts] =
    useState<PopoutBackgroundType>(windowFilterDefault);

  const [profileMenuState, setProfileMenuState] = useState<boolean>(false);

  function setAction(action: ConfirmActionType) {
    setActionState(action);

    setActionVisible(true);
    setFilterOpts({
      blockClick: true,
      blur: true,
      darken: true,
    });
  }

  function actionAccept() {
    actionState.callback();

    setActionVisible(false);
    setFilterOpts(windowFilterDefault);
  }

  function actionDecline() {
    setActionVisible(false);
    setFilterOpts(windowFilterDefault);
  }

  return (
    <PopoutContext.Provider
      value={{
        actionVisible,
        actionState,
        actionAccept,
        actionDecline,
        setAction,
        filterOpts,
        setFilterOpts,
        profileMenuState,
        setProfileMenuState,
      }}
    >
      {children}
    </PopoutContext.Provider>
  );
}

export default PopoutContextProvider;
