"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function PendingButton({ text }: { text?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      {!text ? "Submit" : text}
    </button>
  );
}
