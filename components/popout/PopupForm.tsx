"use client";
import { useState, useContext } from "react";

import { PopoutContext, InputType } from "@/contexts/PopoutContext";
import { useOutsideClick, useForm } from "@utils/hooks";

import Input from "@components/basic/input";
import Button from "@components/basic/button";

import Style from "./styles/PopupForm.module.css";

export default function PopupForm() {
  const { formState, formVisible, formHide } = useContext(PopoutContext);

  const [values, handleChange] = useForm({});

  const ref = useOutsideClick(() => {
    console.log("Click Outside", formState.persist);
    console.log(formState);

    if (formState.persist) return;
    if (true) return; // temp fix presist?

    formHide();
  });

  // const [isUpdating, setUpdating] = useState(false); // if needed for slow update
  const [isUpdated, setUpdated] = useState(false);

  const info = <p className={Style.error}>Unable to submit</p>;
  if (isUpdated) {
    setTimeout(() => {
      setUpdated(false);
    }, 1000);
  }

  return (
    <div ref={ref as any}>
      {formVisible && (
        <div className={`${Style.wrapper} form`}>
          <form
            className={Style.form}
            action={(data: FormData) => {
              if (formState.onSubmitAction)
                if (formState.fetch?.master_data)
                  formState.onSubmitAction(data, formState.fetch.master_data);
                else formState.onSubmitAction(data, undefined);
              formHide();
              handleChange(null); // reset input values
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

            {isUpdated && info}
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
