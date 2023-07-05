import Style from "./styles/Connecting.module.css";

export default function Connecting({ message }) {
  return (
    <>
      <div className={Style.wrapper}>
        <h2>{message}</h2>
        <div className={Style.load}> </div>
      </div>
    </>
  );
}
