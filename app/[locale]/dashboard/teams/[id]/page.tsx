import { redirect } from "next/navigation";

function page({ params }: { params: { id: string } }) {
  return redirect(params.id + "/players");
}

export default page;
