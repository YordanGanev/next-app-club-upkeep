"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";
import { removeStaff } from "@/utils/actions";

export default function RemoveStaffButton({
  children,
  teamId,
  userId,
  className,
  title,
  message,
}: {
  children?: React.ReactNode;
  teamId: string;
  userId: string;
  className?: string;
  title?: string;
  message?: string;
}) {
  const { setAction } = useContext(PopoutContext);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      className={className}
      onClick={() => {
        setAction({
          title: title ? title : "Remove Staff member",
          message: message
            ? message
            : "Staff member will no longer have access to this team",
          callback: () => {
            startTransition(() => {
              removeStaff(teamId, userId);
            });
          },
        });
      }}
    >
      {children}
    </button>
  );
}
