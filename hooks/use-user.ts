import { getCurrentUser } from "@/actions/user.actions";

export async function getUser() {
  const result = await getCurrentUser();
  if (!result.error) return null;
  return result.data?.user;
}
