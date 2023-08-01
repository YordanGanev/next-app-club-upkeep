"use client";

import { useForm } from "@/utils/hooks";
import { updateUser } from "@utils/actions";
import dayjs from "dayjs";
import DateLocalizationProvider from "@contexts/DateProvider";

import Input from "@components/basic/input";

import Style from "./profile.module.css";

export default function ProfileForm({ appUser }: { appUser: any }) {
  const [values, handleChange] = useForm(
    (({ name, birthdate, country }) => ({ name, birthdate, country }))(appUser)
  );

  return (
    <DateLocalizationProvider>
      <div className={Style.formWrapper}>
        <form className={`form ${Style.form}`} action={updateUser}>
          <div>
            <label htmlFor="name">Name</label>
            <Input
              inputProps={{
                type: "text",
                name: "name",
                required: true,
                value: values.name,
              }}
              handleChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="birthdate">Birthday</label>
            <Input
              inputProps={{
                type: "Date",
                name: "birthdate",
                value: dayjs(new Date(values.birthdate)),
                format: "DD/MM/YYYY",
              }}
              handleChange={handleChange}
            />
          </div>

          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </DateLocalizationProvider>
  );
}
