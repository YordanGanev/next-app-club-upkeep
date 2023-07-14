import { redirect } from "next/navigation";

function page({ params }: { params: { id: string } }) {
  return redirect(params.id + "/teams");
}

export default page;
