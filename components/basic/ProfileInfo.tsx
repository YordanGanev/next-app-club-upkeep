import Style from "./styles/ProfileInfo.module.css";

export type ProfileInfoListType = { note: string; responsive?: boolean }[];

export default function ProfileInfo({
  title,
  list,
}: {
  title: string;
  list: ProfileInfoListType;
}) {
  if (list === undefined) return <></>;

  return (
    <div className={Style.wrapper}>
      <h3>{title}</h3>
      <div className={Style.info}>
        {list.map((item, id) => (
          <span
            key={`${title}-item-${id}`}
            className={item.responsive ? Style.responsive : ""}
          >
            {item.note}
          </span>
        ))}
      </div>
    </div>
  );
}
