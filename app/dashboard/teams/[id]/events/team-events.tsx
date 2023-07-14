"use client";

import { useContext } from "react";
import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

import WizzardButton from "@/components/basic/wizButton";

import { useParams } from "next/navigation";

export default function TeamEventsPage({
  appUser,
  writeAccess,
}: {
  appUser: any;
  writeAccess: boolean;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const { id } = useParams();

  return (
    <>
      <h1>{id}</h1>
      {writeAccess && <WizzardButton form={{}} />}
    </>
  );
}
