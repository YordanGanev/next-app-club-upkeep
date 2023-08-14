"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";
import { cancelInvite } from "@/utils/actions";

export default function CancelInviteButton({
  children,
  teamId,
  userId,
  className,
}: {
  children?: React.ReactNode;
  teamId: string;
  userId: string;
  className?: string;
}) {
  const { setAction } = useContext(PopoutContext);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={className}
      onClick={() => {
        setAction({
          title: "Cancel invite",
          message: "Cancel the invite for the user?",
          callback: () => {
            startTransition(() => {
              cancelInvite(teamId, userId);
            });
          },
        });
      }}
    >
      {children}
    </button>
  );
}
