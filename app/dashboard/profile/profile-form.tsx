"use client";

import { useForm } from "@/utils/hooks";
import { updateUser } from "@/utils/actions";
import dayjs from "dayjs";
import DateLocalizationProvider from "@/contexts/DateProvider";

import PendingButton from "@/components/basic/PendingButton";
import Input from "@/components/basic/input";

import Style from "./profile.module.css";
import { GenderType } from "@prisma/client";

export default function ProfileForm({ appUser }: { appUser: any }) {
  const [values, handleChange] = useForm(
    (({ name, birthdate, gender }) => ({ name, birthdate, gender }))(appUser)
  );

  const genderOptions = [
    { value: GenderType.MIXED, label: "Not specified" },
    { value: GenderType.WOMEN, label: "Woman" },
    { value: GenderType.MEN, label: "Man" },
  ];

  const genderOptionDefault = genderOptions.findIndex((g) => {
    if (g.value === values.gender) return true;
  });

  return (
    <DateLocalizationProvider>
      <div className={Style.formWrapper}>
        <form className={`form ${Style.form}`} action={updateUser}>
          <h3>Edit profile</h3>
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
            <label htmlFor="gender">Gender</label>
            <Input
              inputProps={{
                type: "Select",
                name: "gender",
                options: genderOptions,
                defaultValue: genderOptions[genderOptionDefault],
                value: values.gender,
              }}
              handleChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="birthdate">Birthdate</label>
            <Input
              inputProps={{
                type: "Date",
                name: "birthdate",
                value: dayjs(new Date(values.birthdate)),
                format: "DD/MM/YYYY",
                maxDate: dayjs(new Date()),
              }}
              handleChange={handleChange}
            />
          </div>

          <div>
            <PendingButton />
          </div>
        </form>
      </div>
    </DateLocalizationProvider>
  );
}
