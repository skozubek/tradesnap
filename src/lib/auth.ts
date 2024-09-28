// File: src/lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export async function getCurrentUser(): Promise<User> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  // Ensure all properties are present, even if undefined
  return {
    id: session.user.id,
    name: session.user.name ?? undefined,
    email: session.user.email ?? undefined,
    image: session.user.image ?? undefined,
  };
}