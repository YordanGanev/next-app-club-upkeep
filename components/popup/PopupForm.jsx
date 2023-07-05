import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useOutsideClick, useForm } from "utils/hooks";

import Input from "components/basic/input";
import Button from "components/basic/button";

import Style from "./styles/PopupForm.module.css";

// TEST
import dayjs from "dayjs";

export default function PopupForm({ form }) {
  const router = useRouter();
  const [values, handleChange] = useForm({
    // time: dayjs(new Date()),
    // date: dayjs(new Date()),
    // note: "TEST Note",
  }); // [{name: null, sportType: null}];
  // const ref = useOutsideClick(() => form?.state.set(false));
  const ref = useOutsideClick(() => {
    // allow events page to use custom calendar selector
    if (router.pathname !== "/teams/[uid]/events") form?.state.set(false);
  });

  // const [isUpdating, setUpdating] = useState(false); // if needed for slow update
  const [isUpdated, setUpdated] = useState(false);

  async function postData(data = {}) {
    if (data === {}) return null;
    //console.warn(data);
    const response = await fetch(form.fetch.url, {
      method: form.fetch.method,
      headers: form.fetch.headers,
      body: JSON.stringify(data),
    });
    // console.log(response);
    return response.json();
  }

  const formSubmitHandler = (e) => {
    // console.log('formSubmitHandler auto?:)')
    e.preventDefault();

    //console.log(e);
    console.log(values);
    // setUpdating(true);

    //console.error(form.fetch?.master_data);
    postData({ data: values, master_data: form.fetch?.master_data }).then(
      (data) => {
        //console.log('then', data); // JSON data parsed by `data.json()` call
        // setUpdating(false);

        setUpdated(true);

        if (data !== null && data?.status !== "error") {
          form.state.set(false);
          console.warn(router);
          router.replace(router.asPath, undefined, { scroll: false });
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
  useEffect(() => {
    if (form?.state?.visible && form?.refresh === true) handleChange(null);
  }, [form?.state?.visible]);

  return (
    <div ref={ref}>
      {form?.state?.visible && form?.state?.set && (
        <div className={`${Style.wrapper} form`}>
          <form className={Style.form} onSubmit={(e) => formSubmitHandler(e)}>
            <div className={Style.header}>
              <div></div>
              <h2>{form?.title ? form.title : "Input form"}</h2>
              <button
                className={Style.close}
                onClick={(e) => {
                  form.state.set(false);
                }}
              ></button>
            </div>

            {form?.inputs.map((input) => {
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
                label={form?.buttonLabel ? form?.buttonLabel : "Submit"}
                type="submit"
                isSpecial={false}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
