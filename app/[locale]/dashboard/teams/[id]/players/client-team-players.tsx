"use client";

import { invitePlayer, createPlayer } from "@/utils/actions";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import WizzardButton from "@/components/basic/wizButton";
import { GenderType } from "@prisma/client";

export default function TeamPlayersClient({
  team,
}: {
  team: { id: string; gender: GenderType; ageGroup: number | null };
}) {
  const { id: teamId, gender, ageGroup } = team;

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await fetch("/api/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageGroup,
          gender,
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
    title: "Invite a Player",
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
    onSubmitAction: invitePlayer,
  };

  const createPlayerForm = {
    fetch: {
      master_data: {
        teamId,
      },
    },
    title: "New Player",
    inputs: [
      {
        type: "input",
        name: "name",
        required: true,
        placeholder: "Player name",
      },
    ],
    onSubmitAction: createPlayer,
  };

  return (
    <WizzardButton
      form={form}
      extra={[
        {
          icon: faUserPlus,
          form: createPlayerForm,
        },
      ]}
    />
  );
}
