"use client";

import { useContext } from "react";
import {
  NotificationContext,
  NotificationUpdate,
  UserNotifyContextType,
} from "@/contexts/NotificationContext";

export default function NotificationsUpdate({
  appUser,
}: {
  appUser: UserNotifyContextType;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);
  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  return <></>;
}
