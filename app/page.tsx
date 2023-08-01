import React from "react";
import { prisma } from "@utils/db";

import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";
import Link from "next/link";
export default async function page() {
  const session = await getSession();

  // console.log("session", session);

  if (!session) redirect("/about");

  redirect("/dashboard");
}
