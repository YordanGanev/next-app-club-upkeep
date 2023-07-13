"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@contexts/PopoutContext";
import { deleteMedicalRecord } from "@/utils/actions";

export default function DeleteMedicalButton({
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
          title: "Confirm Action",
          message: "Confirm action",
          callback: () => {
            startTransition(() => {
              deleteMedicalRecord(id);
            });
          },
        });
      }}
    >
      {children}
    </button>
  );
}
