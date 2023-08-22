"use client";

import { createContext, useState } from "react";

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

  formState: FormType;
  setFormState: (form: FormType) => void;
  formVisible: boolean;
  formShow: () => void;
  formHide: () => void;
};

type PopoutBackgroundType = {
  blockClick: boolean;
  blur: boolean;
  darken: boolean;
};

type ConfirmActionType = {
  title: string;
  message: string;
  callback: () => void;
};

export type FormSubmitResultType = {
  success: boolean;
  message?: string;
};

type FormOnSubmitAction = (
  data: FormData,
  master_data: {} | undefined
) => Promise<FormSubmitResultType>;

export type InputType = {
  type: string;
  name: string;
  value?: any | null;
  key?: string | null;
  label?: string | null;
  placeholder?: string | null;
  onChange?: ((e: any) => void) | null;
  required?: boolean | null;
  disabled?: boolean | null;
  format?: string | null;
  options?: any[] | null;
  minDate?: any | null;
  maxDate?: any | null;
  inputRef?: any | null;
  view?: any | null;
  handleChange?: ((e: any) => void) | null;
};

export type FormType = {
  fetch?: {
    url?: string;
    method?: string;
    cached?: boolean;
    headers?: {
      "Content-Type": string;
    };
    master_data?: any;
  };
  persist?: boolean;
  title?: string;
  submitLabel?: string;
  inputs: InputType[];
  onSubmitAction?: FormOnSubmitAction;
};

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

const formDefault = {
  title: "",
  inputs: [],
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
  formState: formDefault,
  setFormState: () => {},
  formVisible: false,
  formShow: () => {},
  formHide: () => {},
};

export const PopoutContext =
  createContext<PopoutContextType>(PopoutContextDefault);

function PopoutContextProvider({ children }: { children: React.ReactNode }) {
  // Confirm Action
  const [actionState, setActionState] =
    useState<ConfirmActionType>(confirmActionDefault);

  const [actionVisible, setActionVisible] = useState<boolean>(false);

  // Filters
  const [filterOpts, setFilterOpts] =
    useState<PopoutBackgroundType>(windowFilterDefault);

  // Form
  const [formState, _setFormState] = useState<FormType>(formDefault);

  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Profile
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

  function formShow() {
    setFormVisible(true);
  }

  function formHide() {
    setFormVisible(false);
  }

  function setFormState(form: FormType) {
    _setFormState(form);
    formShow();
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
        formState,
        setFormState,
        formVisible,
        formShow,
        formHide,
      }}
    >
      {children}
    </PopoutContext.Provider>
  );
}

export default PopoutContextProvider;
