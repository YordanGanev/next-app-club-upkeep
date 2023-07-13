"use client";

import { useContext } from "react";
import {
  NotificationContext,
  NotificationUpdate,
} from "@/contexts/NotificationContext";

export default function TeamsClient({ appUser }: { appUser: any }) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);
  return <></>;
}
