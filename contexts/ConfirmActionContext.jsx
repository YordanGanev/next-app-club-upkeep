"use client";

import { createContext, useEffect, useState } from "react";

export const ConfirmActionContext = createContext(null);

function ConfirmActionProvider({ children }) {
  const init = {
    visible: false,
    message: "Confirm action",
    callback: null,
  };

  const [confirmAction, setConfirm] = useState(init);

  function ConfirmActionSetup(message, callback) {
    setConfirm({
      visible: true,
      message: message,
      callback: callback,
    });
  }

  function AcceptAction() {
    confirmAction.callback();

    setConfirm((prev) => {
      return {
        ...prev,
        visible: false,
        callback: null,
      };
    });
  }

  function DeclineAction() {
    setConfirm({
      visible: false,
      message: "",
      callback: null,
    });
  }

  return (
    <ConfirmActionContext.Provider
      value={{
        confirmAction,
        ConfirmActionSetup,
        AcceptAction,
        DeclineAction,
      }}
    >
      {children}
    </ConfirmActionContext.Provider>
  );
}

export default ConfirmActionProvider;
