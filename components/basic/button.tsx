import Style from "./styles/Button.module.css";

export default function Button(
  {
    label,
    isSpecial,
    isLight,
    callback,
    type,
  }: {
    label?: string;
    isSpecial?: boolean;
    isLight?: boolean;
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
      className={`${isSpecial ? Style.btnExtra : Style.btnNormal} ${
        isLight ? Style.btnLight : ""
      }`}
    >
      {label}
    </button>
  );
}
