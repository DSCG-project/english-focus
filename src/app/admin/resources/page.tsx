import { redirect } from "next/navigation";

export default function AdminResourcesRedirectPage() {
  redirect("/admin/content");
}
