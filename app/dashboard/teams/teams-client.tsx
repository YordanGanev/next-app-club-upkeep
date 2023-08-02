"use client";

import { useContext } from "react";
import {
  NotificationContext,
  NotificationUpdate,
} from "@/contexts/NotificationContext";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default function TeamsClient({ appUser }: { appUser: any }) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);
  return <></>;
}
