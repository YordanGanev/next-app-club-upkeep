import Style from "./styles/Connecting.module.css";

export default function Connecting({ message }: { message: string | null }) {
  return (
    <>
      <div className={Style.wrapper}>
        {message && <h2>{message}</h2>}
        <div className={Style.load}> </div>
      </div>
    </>
  );
}
