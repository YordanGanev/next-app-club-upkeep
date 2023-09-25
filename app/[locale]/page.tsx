import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";

export default async function page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getSession();

  if (!session) redirect(`${locale}/dashboard`);

  redirect(`${locale}/dashboard`);
}
