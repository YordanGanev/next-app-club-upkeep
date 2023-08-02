import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";

import DynamicLink from "@components/basic/dynamic-link";
import CardStyle from "@styles/card-layout.module.css";

export default function ListTeams({ teams }: { teams: any[] | undefined }) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  if (teams)
    return (
      <div className={CardStyle.container}>
        {!teams && null}
        {teams.map((team) => {
          return (
            <div className={CardStyle.card} key={team.id}>
              <DynamicLink href={`/dashboard/teams/${team.id}`}>
                <Image
                  src={team.picture}
                  alt="defaultclubpng"
                  width="100"
                  height="100"
                />

                <div>
                  <h2>{team.name}</h2>

                  <div>
                    <span className={CardStyle.statsLabel}> Created </span>
                    {new Date(team.createdAt).toLocaleDateString(
                      "en-UK",
                      options
                    )}
                  </div>
                  <div>
                    <span className={CardStyle.statsLabel}> Updated </span>
                    {new Date(team.updatedAt).toLocaleDateString(
                      "en-UK",
                      options
                    )}
                  </div>
                  <div className={CardStyle.stats}>
                    <div>
                      <div className={CardStyle.icon}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>{team._count.player}</span>
                      </div>
                      <span className={CardStyle.statsLabel}>Players</span>
                    </div>
                    <div>
                      <div className={CardStyle.icon}>
                        <FontAwesomeIcon icon={faUserTie} />
                        <span>{team._count.staff + 1}</span>
                      </div>
                      <span className={CardStyle.statsLabel}>{"Staff"}</span>
                    </div>
                  </div>
                </div>
              </DynamicLink>
            </div>
          );
        })}
      </div>
    );

  return null;
}
