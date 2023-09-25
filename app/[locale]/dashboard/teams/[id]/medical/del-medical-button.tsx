"use client";

import { useContext, useTransition } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";
import { deleteMedicalRecord } from "@/utils/actions";

export default function DeleteMedicalButton({
  children,
  id,
  className,
  ...props
}: {
  children?: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { setAction } = useContext(PopoutContext);
  const [isPending, startTransition] = useTransition();

  console.log(props);

  return (
    <button
      {...props}
      className={className}
      disabled={isPending}
      onClick={() => {
        setAction({
          title: "Delete Medical Record",
          message: "Permanently delete the medical record?",
          callback: () => {
            startTransition(() => {
              deleteMedicalRecord(id)
                .then((result) => {
                  console.log(result);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          },
        });
      }}
    >
      {children}
    </button>
  );
}
