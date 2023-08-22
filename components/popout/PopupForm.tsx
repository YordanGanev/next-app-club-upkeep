"use client";
import { useState, useContext } from "react";

import {
  PopoutContext,
  InputType,
  FormSubmitResultType,
} from "@/contexts/PopoutContext";
import { useOutsideClick, useForm } from "@/utils/hooks";

import Input from "@/components/basic/input";
import Button from "@/components/basic/button";

import Style from "./styles/PopupForm.module.css";

export default function PopupForm() {
  const { formState, formVisible, formHide } = useContext(PopoutContext);

  const [values, handleChange] = useForm({});

  const ref = useOutsideClick(() => {
    // console.log("Click Outside", formState.persist);
    // console.log(formState);

    if (formState.persist) return;
    if (true) return; // temp fix presist?

    formHide();
  });

  // const [isUpdating, setUpdating] = useState(false); // if needed for slow update
  const [isUpdated, setUpdated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (isUpdated) {
    setTimeout(() => {
      setUpdated(false);
      setErrorMsg("");
    }, 5000);
  }

  return (
    <div ref={ref as any}>
      {formVisible && (
        <div className={`${Style.wrapper} form`}>
          <form
            className={Style.form}
            action={(data: FormData) => {
              if (formState.onSubmitAction)
                formState
                  .onSubmitAction(data, formState.fetch?.master_data)
                  .then((result: FormSubmitResultType) => {
                    console.log(result);
                    if (result.success) {
                      formHide();
                      handleChange(null); // reset input values
                    } else {
                      setErrorMsg(result?.message || "Unable to submit");
                      setUpdated(true);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    setErrorMsg("Unable to submit");
                    setUpdated(true);
                  });
            }}
          >
            <div className={Style.header}>
              <div></div>
              <h2>{formState?.title ? formState.title : "Input form"}</h2>
              <button
                type="button"
                className={Style.close}
                onClick={(e) => {
                  formHide();
                }}
              ></button>
            </div>

            {formState?.inputs.map((input: InputType) => {
              input["value"] = values[input.name];
              return (
                <div
                  className={Style.formField}
                  key={`${input.type}_${input.name}`}
                >
                  <Input inputProps={input} handleChange={handleChange} />
                </div>
              );
            })}

            {isUpdated && (
              <div className={Style.error}>
                <div className={Style.errorMsg}>{errorMsg}</div>
              </div>
            )}

            <div className={Style.formField}>
              <Button
                type="submit"
                label={
                  formState?.submitLabel ? formState?.submitLabel : "Submit"
                }
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
