import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DevDarshanMarg database...");

  // Admin user (password: admin123)
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@devdarshanmarg.com" },
    update: {},
    create: {
      email: "admin@devdarshanmarg.com",
      passwordHash,
      name: "Admin",
      role: "admin",
    },
  });

  // Deity types
  const deityTypes = [
    { slug: "shiva", sortOrder: 1 },
    { slug: "vishnu", sortOrder: 2 },
    { slug: "shakti", sortOrder: 3 },
    { slug: "ganesh", sortOrder: 4 },
    { slug: "hanuman", sortOrder: 5 },
  ];
  for (const d of deityTypes) {
    await prisma.deityType.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
  }

  // Temple categories
  const categories = [
    { slug: "jyotirlinga", sortOrder: 1 },
    { slug: "shakti-peeth", sortOrder: 2 },
    { slug: "historical", sortOrder: 3 },
    { slug: "char-dham", sortOrder: 4 },
  ];
  for (const c of categories) {
    await prisma.templeCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // India location
  const country = await prisma.country.upsert({
    where: { code: "IND" },
    update: {},
    create: { code: "IND", slug: "india" },
  });

  const gujarat = await prisma.state.upsert({
    where: { countryId_slug: { countryId: country.id, slug: "gujarat" } },
    update: {},
    create: { countryId: country.id, slug: "gujarat", code: "GJ" },
  });

  await prisma.city.upsert({
    where: { stateId_slug: { stateId: gujarat.id, slug: "somnath" } },
    update: {},
    create: {
      stateId: gujarat.id,
      slug: "somnath",
      latitude: 20.8880,
      longitude: 70.4012,
    },
  });

  // Content types
  const contentTypes = [
    { slug: "article", name: "Article" },
    { slug: "guide", name: "Pilgrimage Guide" },
    { slug: "story", name: "Spiritual Story" },
  ];
  for (const ct of contentTypes) {
    await prisma.contentType.upsert({
      where: { slug: ct.slug },
      update: {},
      create: ct,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
