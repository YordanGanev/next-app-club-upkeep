"use client";
import Style from "./styles/WizButton.module.css";

import { useContext, useEffect } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";

export default function WizzardButton({ form, extra }) {
  const { setFormState } = useContext(PopoutContext);

  return (
    <div className={Style.wrapper}>
      {extra?.map((button) => {
        return (
          <button
            key={button?.icon}
            tabIndex={2}
            className={Style.extra}
            onClick={(e) => {
              button.callback(e);
            }}
            onFocus={(e) => console.log(e)}
          >
            <i className={button?.icon}></i>
          </button>
        );
      })}
      <button
        key={Style.wizButton}
        tabIndex={1}
        className={Style.wizButton}
        onClick={() => setFormState(form)}
      />
    </div>
  );
}
