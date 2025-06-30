// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma"; // Adjust the import path as necessary

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Rahim Uddin", email: "rahim@example.com" },
      { name: "Karim Khan", email: "karim@example.com" },
      { name: "Sadia Rahman", email: "sadia@example.com" },
    ],
  });

  console.log("✅ Users seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
