"use client";
import { inviteStaff } from "@/utils/actions";

import WizzardButton from "@/components/basic/wizButton";

export default function TeamStaffClient({
  invites,
  writeAccess,
  teamId,
}: {
  invites: any;
  writeAccess: boolean;
  teamId: string;
}) {
  const loadOptions = async (inputValue: string) => {
    try {
      const response = await fetch("/api/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: invites?.map((i: any) => i.user?.email),
          teamId,
          search: inputValue,
        }),
        cache: "no-cache",
      });
      const data = await response.json();

      return data?.map((person: { email: string }) => {
        return {
          value: person.email, // id
          label: person.email,
        };
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const form = {
    fetch: {
      master_data: {
        teamId,
      },
    },
    title: "Invite Staff member",
    buttonLabel: "Invite",
    inputs: [
      {
        type: "asyncSelect",
        name: "email",
        required: true,
        placeholder: "Search by email",
        loadOptions: loadOptions,
      },
    ],
    onSubmitAction: inviteStaff,
  };

  return <>{writeAccess && <WizzardButton form={form} extra={null} />}</>;
}
