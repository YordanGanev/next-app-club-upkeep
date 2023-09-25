"use client";

import { useForm } from "@/utils/hooks";
import { updateUser } from "@/utils/actions";
import dayjs from "dayjs";
import DateLocalizationProvider from "@/contexts/DateProvider";

import PendingButton from "@/components/basic/PendingButton";
import Input from "@/components/basic/input";

import Style from "./profile.module.css";
import { GenderType } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function ProfileForm({ appUser }: { appUser: any }) {
  const [values, handleChange] = useForm(
    (({ name, birthdate, gender, country }) => ({
      name,
      birthdate,
      gender,
      country,
    }))(appUser)
  );

  console.log(appUser);

  const t = useTranslations("UserEdit");

  const genderOptions = [
    { value: GenderType.MIXED, label: t("gnone") },
    { value: GenderType.WOMEN, label: t("gwoman") },
    { value: GenderType.MEN, label: t("gman") },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "bg", label: "Български" },
    { value: "de", label: "Deutsch" },
  ];

  const genderOptionDefault = genderOptions.findIndex((g) => {
    if (g.value === values.gender) return true;
  });

  const languageOptionDefault = languageOptions.findIndex((l) => {
    if (l.value === values.country) return true;
  });

  return (
    <DateLocalizationProvider>
      <div className={Style.formWrapper}>
        <form className={`form ${Style.form}`} action={updateUser}>
          <h3 onClick={() => console.log(values)}>{t("title")}</h3>
          <div>
            <label htmlFor="country">{t("language")}</label>
            <Input
              inputProps={{
                type: "Select",
                name: "country",
                options: languageOptions,
                defaultValue: languageOptions[languageOptionDefault],
                value: values.country,
              }}
              handleChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="name">{t("name")}</label>
            <Input
              inputProps={{
                type: "text",
                name: "name",
                required: true,
                value: values.name,
                id: "name",
              }}
              handleChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="gender">{t("gender")}</label>
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
            <label htmlFor="birthdate">{t("birthdate")}</label>
            <Input
              inputProps={{
                type: "Date",
                name: "birthdate",
                value: dayjs(new Date(values.birthdate)),
                defaultValue: values.birthdate,
                format: "DD/MM/YYYY",
                maxDate: dayjs(new Date()),
              }}
              handleChange={handleChange}
            />
          </div>

          <div>
            <PendingButton text={t("submit")} />
          </div>
        </form>
      </div>
    </DateLocalizationProvider>
  );
}
