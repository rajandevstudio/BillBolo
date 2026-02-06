import { ensureUser, updatePhone } from "@/lib/user";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnBoardingForm";

export default async function OnboardingPage() {
  const user = await ensureUser();

  if (!user) redirect("/");
  if (user.phone) redirect("/dashboard");


  return <OnboardingForm userId={user.id}/>;
}
