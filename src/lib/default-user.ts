import { prisma } from "@/lib/prisma";

const DEFAULT_EMAIL = "demo@pkb.local";

export async function getDefaultUser() {
  return prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      email: DEFAULT_EMAIL,
      name: "演示用户",
    },
  });
}
