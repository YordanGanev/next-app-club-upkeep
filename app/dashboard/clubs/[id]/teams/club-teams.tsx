"use client";

import { useContext } from "react";
import { SportType } from "@prisma/client";
import { addTeam } from "@/utils/actions";

import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

import WizzardButton from "@/components/basic/wizButton";

function ClubTeams({ appUser, clubId }: { appUser: any; clubId: string }) {
  const { notification, setNotifyInvites, setNotifyOptions, setNotifyState } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const sportTypeOptions = [
    { value: SportType.FOOTBALL, label: "Football" },
    { value: SportType.VOLLEYBALL, label: "Volleyball" },
    { value: SportType.BASKETBALL, label: "Basketball" },
    { value: SportType.HANDBALL, label: "Handball" },
    { value: SportType.ICE_HOKEY, label: "Ice Hokey" },
    { value: SportType.FIELD_HOKEY, label: "Field Hokey" },
    { value: SportType.RUGBY, label: "Rugby" },
    { value: SportType.OTHER, label: "Other" },
  ];

  // Form setup Object
  const form = {
    fetch: {
      url: "/api/team",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      master_data: {
        clubId,
      },
    },
    title: "Add team",
    inputs: [
      {
        type: "text",
        name: "name",
        required: true,
        placeholder: "Team Name",
      },
      {
        type: "Select",
        name: "sport",
        placeholder: "Select sport type",
        options: sportTypeOptions,
      },
    ],
    onSubmitAction: addTeam,
  };

  return <WizzardButton form={form} extra={null} />;
}

export default ClubTeams;
