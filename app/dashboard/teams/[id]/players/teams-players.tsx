"use client";

import { useContext } from "react";

import { Prisma } from "@prisma/client";

import {
  NotificationContext,
  NotificationUpdate,
  UserNotifyContextType,
} from "@/contexts/NotificationContext";

import { invitePlayer } from "@utils/actions";

import WizzardButton from "@components/basic/wizButton";

const InvitesUser = Prisma.validator<Prisma.InviteArgs>()({
  include: {
    user: true,
  },
});

type InviteUser_t = Prisma.InviteGetPayload<typeof InvitesUser>;

export default function TeamPlayersClient({
  appUser,
  writeAccess,
  teamId,
}: {
  appUser: UserNotifyContextType;
  writeAccess: boolean;
  teamId: string;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const invites = appUser?.invite;

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await fetch("/api/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: invites?.map((i: any) => i.user.email),
          teamId,
          search: inputValue,
        }),
        cache: "no-cache",
      });
      const data = await response.json();

      return data?.map((person: { email: string }) => {
        return {
          value: person.email, // id
          label: person.email,
        };
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const form = {
    fetch: {
      master_data: {
        teamId,
      },
    },
    title: "Invite a Player",
    buttonLabel: "Invite",
    inputs: [
      {
        type: "asyncSelect",
        name: "email",
        required: true,
        placeholder: "Search by email",
        loadOptions: loadOptions,
      },
    ],
    onSubmitAction: invitePlayer,
  };

  return <>{writeAccess && <WizzardButton form={form} extra={null} />}</>;
}