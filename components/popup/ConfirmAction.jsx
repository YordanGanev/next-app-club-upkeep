import { useContext } from "react";

import { useOutsideClick } from "utils/hooks";
import { ConfirmActionContext } from "contexts/ConfirmActionContext";

import Button from "components/basic/button";

import Style from "./styles/ConfirmAction.module.css";

export default function ConfirmAction() {
  const ref = useOutsideClick(() => DeclineAction());

  const { confirmAction, AcceptAction, DeclineAction } =
    useContext(ConfirmActionContext);

  return (
    <div ref={ref}>
      {confirmAction.visible && (
        <div className={Style.wrapper}>
          <div className={Style.form} onSubmit={(e) => formSubmitHandler(e)}>
            <div className={Style.header}>
              <div></div>
              <h2>Confirm Action</h2>
              <button
                className={Style.close}
                onClick={(e) => {
                  DeclineAction();
                }}
              ></button>
            </div>
            <div className={Style.message}>
              <h3>{confirmAction.message}</h3>
            </div>
            <div className={Style.buttons}>
              <Button
                label={"Confirm"}
                isSpecial={true}
                callback={AcceptAction}
              />
              <Button
                label={"Decline"}
                isSpecial={false}
                callback={DeclineAction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
