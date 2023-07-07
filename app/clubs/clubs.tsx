"use client";

// Functionality
import { useState, useContext } from "react";

import { Club, Team } from "@prisma/client";

import WizzardButton from "@components/basic/wizButton";

import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

export default function ClubsClient({ appUser }: { appUser: any }) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  let form = {
    fetch: {
      url: "/api/club",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    title: "Create Club",
    inputs: [
      {
        type: "text",
        name: "name",
        required: true,
        placeholder: "Club Name",
      },
    ],
  };

  return <WizzardButton extra={null} state={null} />;
}
