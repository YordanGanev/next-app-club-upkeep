"use client";

// Functionality
import { useContext } from "react";

import { Club, Team } from "@prisma/client";

import WizzardButton from "@components/basic/wizButton";

import { addClub } from "@utils/actions";

import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

export default function ClubsClient({ appUser }: { appUser: any }) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const form = {
    title: "Create Club",
    inputs: [
      {
        type: "text",
        name: "name",
        required: true,
        placeholder: "Club Name",
      },
    ],
    onSubmitAction: addClub,
  };

  return <WizzardButton form={form} extra={null} />;
}
