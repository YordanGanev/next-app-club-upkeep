"use client";

import { useContext } from "react";

import { useOutsideClick } from "@utils/hooks";
import { PopoutContext } from "@contexts/PopoutContext";

import Button from "@components/basic/button";

import Style from "./styles/ConfirmAction.module.css";

export default function ConfirmAction() {
  const { actionVisible, actionState, actionAccept, actionDecline } =
    useContext(PopoutContext);

  const ref = useOutsideClick(() => actionDecline());

  return (
    <div ref={ref as any}>
      {actionVisible && (
        <div className={Style.wrapper}>
          <div className={Style.form} onSubmit={(e) => console.log(e)}>
            <div className={Style.header}>
              <div></div>
              <h2>{actionState?.title}</h2>
              <button
                className={Style.close}
                onClick={(e) => {
                  actionDecline();
                }}
              ></button>
            </div>
            <div className={Style.message}>
              <h3>{actionState?.message}</h3>
            </div>
            <div className={Style.buttons}>
              <Button
                label={"Confirm"}
                isSpecial={true}
                callback={actionAccept}
                type={null}
              />
              <Button
                label={"Decline"}
                isSpecial={false}
                callback={actionDecline}
                type={null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
