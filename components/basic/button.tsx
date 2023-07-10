import Style from "./styles/Button.module.css";

export default function Button(
  {
    label,
    isSpecial,
    callback,
    type,
  }: {
    label?: string;
    isSpecial?: boolean;
    callback?: () => void;
    type?: "submit" | "button" | "reset" | undefined;
  } = {
    label: "Button",
    isSpecial: false,
    callback: () => {},
    type: undefined,
  }
) {
  return (
    <button
      type={type}
      onClick={(e) => {
        // e.persist();
        if (callback) callback();
      }}
      className={isSpecial ? Style.btnExtra : Style.btnNormal}
    >
      {label}
    </button>
  );
}
