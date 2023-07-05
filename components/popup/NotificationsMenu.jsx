import { useUser } from "@auth0/nextjs-auth0/client";
import { useOutsideClick } from "utils/hooks";

import Image from "next/image";
import Style from "./styles/Notifications.module.css";

import Button from "components/basic/button";
import { useRouter } from "next/router";

import { useContext } from "react";

import { NotificationContext } from "contexts/NotificationContext";

export default function NotificationsMenu() {
  const { user, isLoading } = useUser();

  const { notification, setNotifyState, setNotifyOptions } =
    useContext(NotificationContext);

  const router = useRouter();

  const ref = useOutsideClick(() => {
    setNotifyState(false);
  });

  if (!notification?.visible) return null;
  if (notification?.options?.length === 0) return null;

  const removeRow = (remove) => {
    if (notification.options?.length === 1) setNotifyState(false);

    setNotifyOptions(
      notification.options?.filter((opt) => opt.team.name !== remove)
    );
  };

  const inviteHandler = async (accept, { userId, teamId }) => {
    await fetch("/api/invite/reply", {
      method: accept ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, teamId }),
    }).then(() => {
      if (accept && router.pathname === "/teams") {
        router.replace(router.asPath);
      }
    });
  };

  // Display Empty div to keep component reference
  // This Fixes warnings for returning null if not visible
  return (
    <div ref={ref}>
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
            {notification.options?.map((inv) => {
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
                    <p>{inv.type}</p>
                    <div className={Style.buttons}>
                      <Button
                        label="Decline"
                        callback={() => {
                          removeRow(inv.team.name);
                          inviteHandler(false, inv);
                        }}
                      />
                      <Button
                        label="Accept"
                        isSpecial={true}
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
