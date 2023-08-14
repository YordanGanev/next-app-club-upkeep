import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <h1>Custom Page Not Found</h1>
      <Link href={"/home"}>Back home</Link>
    </>
  );
}
