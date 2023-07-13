"use client";

// Functionality
import { useState, useContext } from "react";

import { Prisma, Player, User, Medical } from "@prisma/client";

import WizzardButton from "@components/basic/wizButton";

import { addMedicalRecord } from "@utils/actions";

import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

const Player_User = Prisma.validator<Prisma.PlayerArgs>()({
  select: {
    user: {
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        picture: true,
      },
    },
    id: true,
    medical: true,
    name: true,
    picture: true,
  },
});

type Player_User_t = Prisma.PlayerGetPayload<typeof Player_User>;

export default function TeamMedicalClient({
  appUser,
  writeAccess,
  players,
  teamId,
}: {
  appUser: any;
  writeAccess: boolean;
  players?: Player_User_t[] | undefined;
  teamId?: string | undefined;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  if (!writeAccess) return null;

  if (!players || !teamId) return null;

  const form = {
    fetch: {
      master_data: { teamId },
    },
    title: "Add Medical Record",
    inputs: [
      {
        type: "Select",
        name: "id",
        required: true,
        placeholder: "Select player",
        options: players?.map((p: Player_User_t) => {
          if (p.user)
            return {
              value: p.id,
              label:
                p.user.name === p.user.email ? p.user.nickname : p.user.name,
            };
          return {
            value: p.id,
            label: p.name,
          };
        }),
      },
      {
        type: "number",
        name: "weight",
        required: true,
        placeholder: "Weight kg",
      },
      {
        type: "number",
        name: "height",
        required: true,
        placeholder: "Height cm",
      },
    ],
    onSubmitAction: addMedicalRecord,
  };

  return <WizzardButton form={form} extra={null} />;
}
