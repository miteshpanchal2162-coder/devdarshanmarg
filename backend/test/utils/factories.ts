import { PrismaClient, Status, UserRole } from "@prisma/client";
import { hash } from "bcrypt";

export type TestContext = {
  adminEmail: string;
  adminId: string;
  adminPassword: string;
  areaId: string;
  cityId: string;
  contentItemId: string;
  contentItemTypeId: string;
  continentId: string;
  countryId: string;
  deityId: string;
  deityTypeId: string;
  festivalId: string;
  otherUserEmail: string;
  otherUserId: string;
  otherUserPassword: string;
  panchangId: string;
  prisma: PrismaClient;
  stateId: string;
  templeId: string;
  userEmail: string;
  userId: string;
  userMobile: string;
  userPassword: string;
  vratId: string;
};

let sharedPrisma: PrismaClient | null = null;

export function getTestPrisma() {
  if (!sharedPrisma) {
    sharedPrisma = new PrismaClient();
  }
  return sharedPrisma;
}

export async function disconnectTestPrisma() {
  if (sharedPrisma) {
    await sharedPrisma.$disconnect();
    sharedPrisma = null;
  }
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function testMobile(index: number) {
  const base = Date.now().toString().slice(-9);
  return `+91${base.slice(0, 9)}${index}`;
}

export async function seedTestContext(): Promise<TestContext> {
  const prisma = getTestPrisma();
  const suffix = uniqueSuffix();

  const adminPassword = await hash("AdminTest123!", 12);
  const userPassword = await hash("UserTest123!", 12);
  const otherPassword = await hash("OtherTest123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: `admin-${suffix}@test.devdarshanmarg.com`,
      fullName: "Test Admin",
      mobile: testMobile(1),
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: Status.ACTIVE,
      emailVerified: true,
      mobileVerified: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: `user-${suffix}@test.devdarshanmarg.com`,
      fullName: "Test User",
      mobile: testMobile(2),
      passwordHash: userPassword,
      role: UserRole.USER,
      status: Status.ACTIVE,
      emailVerified: true,
      mobileVerified: true,
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      email: `other-${suffix}@test.devdarshanmarg.com`,
      fullName: "Other User",
      mobile: testMobile(3),
      passwordHash: otherPassword,
      role: UserRole.USER,
      status: Status.ACTIVE,
      emailVerified: true,
      mobileVerified: true,
    },
  });

  const continent = await prisma.continent.create({
    data: {
      name: `Test Continent ${suffix}`,
      slug: `test-continent-${suffix}`,
      code: `C${suffix.slice(-5)}`.slice(0, 10),
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const country = await prisma.country.create({
    data: {
      name: `Test Country ${suffix}`,
      slug: `test-country-${suffix}`,
      iso2: `T${suffix.slice(-1)}`.padEnd(2, "X").slice(0, 2),
      iso3: `TS${suffix.slice(-1)}`.padEnd(3, "X").slice(0, 3),
      continentId: continent.id,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const state = await prisma.state.create({
    data: {
      countryId: country.id,
      name: `Test State ${suffix}`,
      slug: `test-state-${suffix}`,
      code: "TS",
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const city = await prisma.city.create({
    data: {
      countryId: country.id,
      stateId: state.id,
      name: `Test City ${suffix}`,
      slug: `test-city-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const area = await prisma.area.create({
    data: {
      countryId: country.id,
      stateId: state.id,
      cityId: city.id,
      name: `Test Area ${suffix}`,
      slug: `test-area-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const deityType = await prisma.deityType.create({
    data: {
      name: `Test Deity Type ${suffix}`,
      slug: `test-deity-type-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const deity = await prisma.deity.create({
    data: {
      deityTypeId: deityType.id,
      name: `Test Deity ${suffix}`,
      slug: `test-deity-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const festival = await prisma.festival.create({
    data: {
      name: `Test Festival ${suffix}`,
      slug: `test-festival-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const panchang = await prisma.panchang.create({
    data: {
      panchangCode: `PANCH-${suffix}`,
      name: `Test Panchang ${suffix}`,
      slug: `test-panchang-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const vrat = await prisma.vrat.create({
    data: {
      vratCode: `VRAT-${suffix}`,
      name: `Test Vrat ${suffix}`,
      slug: `test-vrat-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const contentItemType = await prisma.contentItemType.create({
    data: {
      name: `Test Content Type ${suffix}`,
      slug: `test-content-type-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const contentItem = await prisma.contentItem.create({
    data: {
      contentTypeId: contentItemType.id,
      contentCode: `CONTENT-${suffix}`,
      slug: `test-content-${suffix}`,
      title: `Test Content ${suffix}`,
      status: Status.ACTIVE,
      publishedAt: new Date(Date.now() - 60_000),
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  const temple = await prisma.temple.create({
    data: {
      countryId: country.id,
      stateId: state.id,
      cityId: city.id,
      areaId: area.id,
      name: `Test Temple ${suffix}`,
      slug: `test-temple-${suffix}`,
      status: Status.ACTIVE,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  await prisma.userProfile.create({
    data: { userId: user.id, bio: "Test profile" },
  });

  return {
    prisma,
    adminId: admin.id,
    adminEmail: admin.email,
    adminPassword: "AdminTest123!",
    userId: user.id,
    userEmail: user.email,
    userMobile: user.mobile,
    userPassword: "UserTest123!",
    otherUserId: otherUser.id,
    otherUserEmail: otherUser.email,
    otherUserPassword: "OtherTest123!",
    continentId: continent.id,
    countryId: country.id,
    stateId: state.id,
    cityId: city.id,
    areaId: area.id,
    deityTypeId: deityType.id,
    deityId: deity.id,
    festivalId: festival.id,
    panchangId: panchang.id,
    vratId: vrat.id,
    contentItemTypeId: contentItemType.id,
    contentItemId: contentItem.id,
    templeId: temple.id,
  };
}

export async function cleanupTestContext(context: TestContext) {
  const { prisma } = context;

  await prisma.activityLog.deleteMany({
    where: {
      OR: [{ userId: context.userId }, { userId: context.adminId }, { userId: context.otherUserId }],
    },
  });
  await prisma.otpVerification.deleteMany({
    where: { mobile: { startsWith: "+91" } },
  });
  await prisma.refreshToken.deleteMany({
    where: {
      userId: { in: [context.userId, context.adminId, context.otherUserId] },
    },
  });
  await prisma.userSession.deleteMany({
    where: {
      userId: { in: [context.userId, context.adminId, context.otherUserId] },
    },
  });
  await prisma.userComment.deleteMany({ where: { userId: context.userId } });
  await prisma.userReview.deleteMany({ where: { userId: context.userId } });
  await prisma.userRating.deleteMany({ where: { userId: context.userId } });
  await prisma.userFavorite.deleteMany({ where: { userId: context.userId } });
  await prisma.userProfile.deleteMany({
    where: { userId: { in: [context.userId, context.otherUserId] } },
  });
  await prisma.mediaLibrary.deleteMany({ where: { uploadedById: context.adminId } });
  await prisma.temple.deleteMany({ where: { id: context.templeId } });
  await prisma.contentItem.deleteMany({ where: { id: context.contentItemId } });
  await prisma.contentItemType.deleteMany({ where: { id: context.contentItemTypeId } });
  await prisma.vrat.deleteMany({ where: { id: context.vratId } });
  await prisma.panchang.deleteMany({ where: { id: context.panchangId } });
  await prisma.festival.deleteMany({ where: { id: context.festivalId } });
  await prisma.deity.deleteMany({ where: { id: context.deityId } });
  await prisma.deityType.deleteMany({ where: { id: context.deityTypeId } });
  await prisma.area.deleteMany({ where: { id: context.areaId } });
  await prisma.city.deleteMany({ where: { id: context.cityId } });
  await prisma.state.deleteMany({ where: { id: context.stateId } });
  await prisma.country.deleteMany({ where: { id: context.countryId } });
  await prisma.continent.deleteMany({ where: { id: context.continentId } });
  await prisma.user.deleteMany({
    where: { id: { in: [context.adminId, context.userId, context.otherUserId] } },
  });
}

export function getSeededCredentials(context: TestContext) {
  return {
    adminEmail: context.adminEmail,
    userEmail: context.userEmail,
    userMobile: context.userMobile,
  };
}
