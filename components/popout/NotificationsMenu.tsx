"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useOutsideClick } from "@/utils/hooks";

import Image from "next/image";
import Style from "./styles/Notifications.module.css";

import Button from "@/components/basic/button";

import { useContext } from "react";

import { NotificationContext } from "@/contexts/NotificationContext";

import { acceptInvite, cancelInvite } from "@/utils/actions";

export default function NotificationsMenu() {
  const { user, isLoading } = useUser();

  const { notification, setNotifyState, setNotifyOptions } =
    useContext(NotificationContext);

  const ref = useOutsideClick(() => {
    setNotifyState(false);
  });

  if (!notification?.visible) return null;
  if (notification?.options?.length === 0) return null;

  const removeRow = (remove: string) => {
    if (notification.options?.length === 1) setNotifyState(false);

    setNotifyOptions(
      notification.options?.filter((opt: any) => opt.team.name !== remove)
    );
  };

  const inviteHandler = async (
    accept: boolean,
    { userId, teamId }: { userId: string; teamId: string }
  ) => {
    if (!accept) cancelInvite(teamId, userId);
    else acceptInvite(teamId, userId);
  };

  // Display Empty div to keep component reference
  // This Fixes warnings for returning null if not visible
  return (
    <div ref={ref as any}>
      {user && !isLoading && (
        <div className={Style.wrapper}>
          <div
            className={Style.close}
            onClick={(e) => setNotifyState(false)}
          ></div>
          <div
            className={Style.notifications}
            onClick={(e) => e.stopPropagation()}
          >
            {notification.options?.map((inv: any) => {
              return (
                <div className={Style.invite} key={inv.team.name}>
                  <div>
                    <Image
                      src={`${inv.team.picture}`}
                      alt="defaultclubpng"
                      width="50"
                      height="50"
                    />
                  </div>
                  <div className={Style.content}>
                    <p>{inv.team.name}</p>
                    <p className={Style.type}>{inv.type}</p>
                    <div className={Style.buttons}>
                      <Button
                        label="Decline"
                        isSpecial={false}
                        isLight={true}
                        callback={() => {
                          removeRow(inv.team.name);
                          inviteHandler(false, inv);
                        }}
                      />
                      <Button
                        label="Accept"
                        isSpecial={true}
                        isLight={true}
                        callback={() => {
                          removeRow(inv.team.name);
                          inviteHandler(true, inv);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
