import Style from "./styles/Button.module.css";

export default function Button(
  { label, isSpecial, callback, type } = {
    label: "Button",
    isSpecial: false,
    callback: () => {},
    type: null,
  }
) {
  return (
    <button
      type={type}
      onClick={callback}
      className={isSpecial ? Style.btnExtra : Style.btnNormal}
    >
      {label}
    </button>
  );
}
