"use client";
import Style from "./styles/WizButton.module.css";

import { useContext, useEffect } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            onClick={() => {
              setFormState(button?.form);
            }}
          >
            <FontAwesomeIcon icon={button?.icon} />
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
