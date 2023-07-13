"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@contexts/PopoutContext";
import { removePlayer } from "@utils/actions";

export default function RemovePlayerButton({
  children,
  id,
  className,
}: {
  children?: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { setAction } = useContext(PopoutContext);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={className}
      onClick={() => {
        setAction({
          title: "Delete Player",
          message:
            "Permanently delete the player?\r\nAll records will be lost.",
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
