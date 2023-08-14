import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";

export default async function page() {
  const session = await getSession();

  if (!session) redirect("/about");

  redirect("/dashboard");
}
