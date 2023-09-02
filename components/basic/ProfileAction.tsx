"use client";

import { useContext, useState, useTransition } from "react";

import { deleteClub, deleteTeam } from "@/utils/actions";
import { FormSubmitResultType, PopoutContext } from "@/contexts/PopoutContext";
import Style from "./styles/ProfileAction.module.css";
import { useRouter } from "next/navigation";

export default function ProfileAction({
  about,
  id,
}: {
  about: "team" | "club";
  id: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  const teamCallback = () => {
    deleteTeam(id).then((res: FormSubmitResultType) => {
      if (res.success === true) {
        console.log("success");
        router.push("/dashboard/teams");
        router.refresh();
      } else {
        res?.message
          ? setError(res.message)
          : setError("Unable to delete team");
      }
    });
  };

  const clubCallback = () => {
    deleteClub(id).then((res: FormSubmitResultType) => {
      if (res.success === true) {
        console.log("success");
        router.push("/dashboard/clubs");
        router.refresh();
      } else {
        res?.message
          ? setError(res.message)
          : setError("Unable to delete club");
      }
    });
  };

  return (
    <div className={Style.wrapper}>
      <h3>
        {about[0].toUpperCase()}
        {about.slice(1)} Actions
      </h3>
      <div className={Style.danger}>
        <div className={Style.form}>
          <div className={Style.info}>
            <p>Delete {about}</p>
            <p>
              You must remove all {about === "team" ? "players" : "teams"} to
              proceed with this action.
            </p>
          </div>
          <SubmitButton
            callback={about === "team" ? teamCallback : clubCallback}
            about={about}
          />
        </div>
        {error.length > 0 && <p className={Style.error}>{error}</p>}
      </div>
    </div>
  );
}

function SubmitButton({
  about,
  callback,
}: {
  about: "team" | "club";
  callback: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { setAction } = useContext(PopoutContext);

  return (
    <button
      className={`global-button global-button-inh border-${
        isPending ? "disabled" : "remove"
      }`}
      onClick={() => {
        startTransition(() => {
          setAction({
            callback,
            message: `Are you sure you want to delete this ${about}?`,
            title: `Delete ${about}`,
          });
        });
      }}
    >
      Delete
    </button>
  );
}
