"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";
import { removePlayer } from "@/utils/actions";

export default function RemovePlayerButton({
  children,
  id,
  className,
  title,
  message,
}: {
  children?: React.ReactNode;
  id: string;
  className?: string;
  title?: string;
  message?: string;
}) {
  const { setAction } = useContext(PopoutContext);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={className}
      onClick={() => {
        setAction({
          title: title ? title : "Delete Player",
          message: message
            ? message
            : "Permanently delete the player?\r\nAll records will be lost.",
          callback: () => {
            startTransition(() => {
              removePlayer(id);
            });
          },
        });
      }}
    >
      {children}
    </button>
  );
}
