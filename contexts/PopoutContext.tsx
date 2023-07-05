"use client";

import { createContext, useEffect, useState } from "react";

type PopoutContextType = {
  actionState: boolean | null;
  actionAccept: () => void;
  actionDecline: () => void;
  setAction: (action: ConfirmActionType) => void;
  filterOpts: PopoutBackgroundType;
  setFilterOpts: (opts: PopoutBackgroundType) => void;
};

const PopoutContextDefault = {
  actionState: false,
  actionAccept: () => {},
  actionDecline: () => {},
  setAction: () => {},
  filterOpts: {
    blockClick: false,
    blur: false,
    darken: false,
  },
  setFilterOpts: () => {},
};

type PopoutBackgroundType = {
  blockClick: boolean;
  blur: boolean;
  darken: boolean;
};

type ConfirmActionType = {
  visible: boolean | null;
  title: string;
  message: string;
  callback: () => void;
};

type ProfileMenuType = {
  visible: boolean;
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

export const PopoutContext =
  createContext<PopoutContextType>(PopoutContextDefault);

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

function PopoutContextProvider({ children }: { children: React.ReactNode }) {
  const [actionState, setActionState] =
    useState<ConfirmActionType>(confirmActionDefault);

  const [filterOpts, setFilterOpts] =
    useState<PopoutBackgroundType>(windowFilterDefault);

  function hideAction() {
    setActionState((prev) => {
      return {
        ...prev,
        visible: false,
      };
    });
  }
  function setAction(action: ConfirmActionType) {
    if (action.visible != true) action.visible = true;

    setActionState(action);
  }

  function actionAccept() {
    actionState.callback();

    hideAction();
  }

  function actionDecline() {
    hideAction();
  }

  return (
    <PopoutContext.Provider
      value={{
        actionState: actionState.visible,
        actionAccept,
        actionDecline,
        setAction,
        filterOpts,
        setFilterOpts,
      }}
    >
      {children}
    </PopoutContext.Provider>
  );
}

export default PopoutContextProvider;
