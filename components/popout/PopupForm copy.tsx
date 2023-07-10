"use client";
import { useState, useEffect, useContext } from "react";

import { PopoutContext, InputType } from "@/contexts/PopoutContext";
import { useOutsideClick, useForm } from "@utils/hooks";

import Input from "@components/basic/input";
import Button from "@components/basic/button";

import Style from "./styles/PopupForm.module.css";

// TEST
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";

export default function PopupForm() {
  const { formState, formVisible, formHide } = useContext(PopoutContext);

  const router = useRouter();
  const pathname = usePathname();

  const [values, handleChange] = useForm({});
  const ref = useOutsideClick(() => {
    // allow events page to use custom calendar selector
    if (pathname !== "/teams/[uid]/events") formHide();
  });

  // const [isUpdating, setUpdating] = useState(false); // if needed for slow update
  const [isUpdated, setUpdated] = useState(false);

  async function postData(data = {}) {
    //console.warn(data);
    const response = await fetch(formState.fetch.url, {
      method: formState.fetch.method,
      headers: formState.fetch.headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  const formSubmitHandler = (e: Event) => {
    e.preventDefault();

    console.log(values);

    postData({ data: values, master_data: formState.fetch?.master_data }).then(
      (data) => {
        setUpdated(true);

        if (data !== null && data?.status !== "error") {
          formHide();
          console.warn(router);
          router.replace(pathname, { scroll: false });
          return null;
        }
      }
    );
  };

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
            // onSubmit={(e: any) => formSubmitHandler(e)}
            action={(e: any) => formSubmitHandler(e)}
          >
            <div className={Style.header}>
              <div></div>
              <h2>{formState?.title ? formState.title : "Input form"}</h2>
              <button
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
