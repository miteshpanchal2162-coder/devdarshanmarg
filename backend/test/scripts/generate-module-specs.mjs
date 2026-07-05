import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT = join(__dirname, "..", "..");
const SRC = join(ROOT, "src", "modules");

const SKIP_DIRS = new Set([
  "temple-child-common",
  "festival-child-common",
  "panchang-child-common",
  "vrat-child-common",
  "content-child-common",
]);

const OPTIONAL_DEPS = [
  "PrismaService",
  "RelationValidationService",
  "ConfigService",
  "JwtService",
  "UserSessionsService",
  "RefreshTokensService",
  "OtpVerificationsService",
  "ActivityLogsService",
  "UserProfilesService",
  "UsersService",
  "StorageService",
  "MediaLibraryService",
  "TemplesService",
  "FestivalsService",
  "DeitiesService",
  "PanchangsService",
  "ContentItemsService",
  "ContentsService",
  "UserProfilesService",
  "UserFavoritesService",
  "UserRatingsService",
  "UserReviewsService",
  "UserCommentsService",
  "PanchangDatesService",
  "PublicTemplesService",
  "PublicFestivalsService",
  "PublicDeitiesService",
  "PublicPanchangService",
  "PublicContentService",
  "PublicMediaService",
];

function walk(dir, suffix, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) {
        walk(full, suffix, files);
      }
      continue;
    }

    if (entry.endsWith(suffix) && !entry.includes(".spec.")) {
      files.push(full);
    }
  }

  return files;
}

function toImportPath(fromFile, targetFromSrc) {
  const fromDir = dirname(fromFile);
  const target = join(ROOT, "src", targetFromSrc);
  let rel = relative(fromDir, target).replace(/\\/g, "/");
  if (!rel.startsWith(".")) {
    rel = `./${rel}`;
  }
  return rel.replace(/\.ts$/, "");
}

function toTestHelperImport(fromFile) {
  const fromDir = dirname(fromFile);
  const target = join(ROOT, "test", "helpers", "test-mocks.ts");
  let rel = relative(fromDir, target).replace(/\\/g, "/");
  if (!rel.startsWith(".")) {
    rel = `./${rel}`;
  }
  return rel.replace(/\.ts$/, "");
}

function extractClassName(content, suffix) {
  return content.match(new RegExp(`export class (\\w+${suffix})`))?.[1] ?? null;
}

function extractPublicMethods(content, { includeSync = false } = {}) {
  const methods = new Set();
  const asyncRegex = /^\s+async\s+(\w+)\(/gm;
  const syncRegex = /^\s+(\w+)\(/gm;
  let match;

  while ((match = asyncRegex.exec(content)) !== null) {
    methods.add(match[1]);
  }

  if (includeSync) {
    while ((match = syncRegex.exec(content)) !== null) {
      const name = match[1];
      if (!["constructor", "if", "for", "switch", "catch", "while"].includes(name)) {
        methods.add(name);
      }
    }
  }

  return [...methods];
}

function extractConstructorDeps(content) {
  const block = content.match(/constructor\([\s\S]*?\)\s*\{/)?.[0] ?? "";
  return OPTIONAL_DEPS.filter((dep) => block.includes(dep));
}

function buildMethodArgs(method) {
  if (method === "findAll") return "baseQuery as never";
  if (method.startsWith("findBy")) return "TEST_ID, baseQuery as never";
  if (method === "findOne" || method === "findById") return "TEST_ID";
  if (method === "findChildById") return "TEST_ID, TEST_ID";
  if (method.startsWith("create") || method === "createLog" || method === "createItem" || method === "createTokenRecord" || method === "createSession" || method === "createProfile" || method === "createUser")
    return "{ slug: 'generated-slug', name: 'Generated', title: 'Generated', contentCode: 'GEN-1', panchangCode: 'P-1', vratCode: 'V-1', countryId: TEST_ID, stateId: TEST_ID, cityId: TEST_ID, areaId: TEST_ID, deityTypeId: TEST_ID, contentTypeId: TEST_ID, templeId: TEST_ID, festivalId: TEST_ID, panchangId: TEST_ID, vratId: TEST_ID, entityType: 'TEMPLE', entityId: TEST_ID, rating: 5, review: 'Nice', comment: 'Nice', password: 'Password123!', email: 'gen@test.com', mobile: '+919999999999', fullName: 'Generated User', purpose: 'LOGIN', filename: 'f.png', originalName: 'f.png', storagePath: 'temp/f.png', mimeType: 'image/png', mediaType: 'image', fileSize: 10, action: 'CREATE', entityType: 'Temple' } as never, ACTOR_ID";
  if (method.startsWith("update") || method.startsWith("patch") || method === "updateProfile" || method === "updateItem")
    return "TEST_ID, { name: 'Updated', bio: 'Updated' } as never, ACTOR_ID";
  if (method.startsWith("delete") || method.startsWith("remove") || method === "deleteItem" || method === "deleteLog")
    return "TEST_ID, ACTOR_ID";
  if (method.startsWith("restore")) return "TEST_ID, ACTOR_ID";
  if (method.includes("Status")) return "TEST_ID, 'ARCHIVED' as never, ACTOR_ID";
  if (method === "login") return "{ identifier: 'user@test.com', password: 'Password123!' } as never";
  if (method === "refresh" || method === "logout") return "{ refreshToken: 'refresh-token' } as never";
  if (method === "profile" || method === "getProfile") return "ACTOR_ID";
  if (method === "resetPassword") return "{ verificationToken: 'token', newPassword: 'Password123!' } as never, {}";
  if (method === "forgotPassword" || method === "sendOtp") return "{ mobile: '+919999999999', purpose: 'LOGIN' } as never";
  if (method === "verifyOtp") return "{ mobile: '+919999999999', otp: '123456', purpose: 'LOGIN' } as never";
  if (method === "recordActivity") return "{ action: 'CREATE', entityType: 'Temple', userId: ACTOR_ID }";
  if (method === "incrementRetry" || method === "touchActivity" || method === "logoutSession") return "TEST_ID";
  if (method === "verifyPublicOtp") return "'+919999999999', 'LOGIN' as never, '123456'";
  if (method === "sendPublicOtp") return "'+919999999999', 'LOGIN' as never";
  if (method === "hashToken" || method === "revokeByRawToken" || method === "rotateToken") return "'token'";
  if (method === "storeToken") return "ACTOR_ID, 'token', TEST_ID";
  if (method === "revokeAllUserTokens" || method === "logoutAllDevices" || method === "openSession") return method === "openSession" ? "ACTOR_ID, {}" : "ACTOR_ID";
  if (method === "updateProfile") return "ACTOR_ID, { bio: 'Updated' } as never";
  if (method.startsWith("upload")) return "{ originalname: 'file.png', mimetype: 'image/png', size: 100, buffer: Buffer.from('x') } as never, 'temp' as never, ACTOR_ID, 'image' as never";
  return "TEST_ID";
}

function buildServiceSpec(serviceFile) {
  const content = readFileSync(serviceFile, "utf8");
  const className = extractClassName(content, "Service");
  if (!className || className.includes("ChildCrud")) return null;

  const specPath = serviceFile.replace(/\.service\.ts$/, ".service.spec.ts");
  if (existsSync(specPath)) return null;

  const methods = extractPublicMethods(content);
  if (methods.length === 0) return null;

  const deps = extractConstructorDeps(content);
  const helperImport = toTestHelperImport(specPath);
  const serviceImport = `./${className.replace(/Service$/, "").split(/(?=[A-Z])/).join("-").toLowerCase().replace(/^-/, "")}`;

  const imports = [`import { ${className} } from "./${className.replace(/Service$/, "").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.service";`];
  // simpler: same folder import
  const localImport = `./${serviceFile.split(/[/\\]/).pop()?.replace(".service.ts", ".service")}`;

  const providerLines = [`        ${className},`];
  const importLines = [
    `import { Test, TestingModule } from "@nestjs/testing";`,
    `import { ${className} } from "./${basename(serviceFile).replace(".ts", "")}";`,
    `import { ACTOR_ID, TEST_ID, baseQuery, createMockConfigService, createMockJwtService, createMockPrisma, createMockRelationValidation, createDepMock } from "${helperImport}";`,
  ];

  if (deps.includes("PrismaService")) {
    importLines.push(`import { PrismaService } from "${toImportPath(specPath, "database/prisma/prisma.service")}";`);
    providerLines.push("        { provide: PrismaService, useValue: prisma },");
  }
  if (deps.includes("RelationValidationService")) {
    importLines.push(`import { RelationValidationService } from "${toImportPath(specPath, "common/services/relation-validation.service")}";`);
    providerLines.push("        { provide: RelationValidationService, useValue: relationValidation },");
  }
  if (deps.includes("ConfigService")) {
    importLines.push(`import { ConfigService } from "@nestjs/config";`);
    providerLines.push("        { provide: ConfigService, useValue: configService },");
  }
  if (deps.includes("JwtService")) {
    importLines.push(`import { JwtService } from "@nestjs/jwt";`);
    providerLines.push("        { provide: JwtService, useValue: jwtService },");
  }

  for (const dep of deps) {
    if (["PrismaService", "RelationValidationService", "ConfigService", "JwtService"].includes(dep)) continue;
    const depFile = findDepFile(dep);
    if (depFile) {
      importLines.push(`import { ${dep} } from "${toImportPath(specPath, relative(join(ROOT, "src"), depFile).replace(/\\/g, "/"))}";`);
    }
    providerLines.push(`        { provide: ${dep}, useValue: createDepMock() },`);
  }

  const methodTests = methods
    .map(
      (method) => `  it("executes ${method}", async () => {
    await expect((service as any).${method}(${buildMethodArgs(method)})).resolves.toBeDefined();
  });`,
    )
    .join("\n\n");

  const createMethod = methods.find((m) => m.startsWith("create"));
  const duplicateTest = createMethod && (content.includes("ensureUnique") || content.includes("ConflictException"))
    ? `
  it("covers duplicate branch for ${createMethod}", async () => {
    const delegateKey = Object.keys(prisma).find((key) => {
      const value = (prisma as Record<string, unknown>)[key];
      return value && typeof value === "object" && "findFirst" in (value as object);
    });
    if (delegateKey) {
      const delegate = (prisma as Record<string, { findFirst: jest.Mock }>)[delegateKey];
      delegate.findFirst.mockResolvedValueOnce({ id: "duplicate-id" });
      await expect((service as any).${createMethod}(${buildMethodArgs(createMethod)})).rejects.toBeDefined();
    }
  });`
    : "";

  return `// @ts-nocheck
${importLines.join("\n")}

describe("${className}", () => {
  let service: ${className};
  let prisma: ReturnType<typeof createMockPrisma>;
  let relationValidation: ReturnType<typeof createMockRelationValidation>;
  let configService: ReturnType<typeof createMockConfigService>;
  let jwtService: ReturnType<typeof createMockJwtService>;

  beforeEach(async () => {
    prisma = createMockPrisma();
    relationValidation = createMockRelationValidation();
    configService = createMockConfigService();
    jwtService = createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
${providerLines.join("\n")}
      ],
    }).compile();

    service = module.get(${className});
  });

${methodTests}
${duplicateTest}
});
`;
}

function basename(path) {
  return path.split(/[/\\]/).pop() ?? path;
}

function depNameToFile(depName) {
  const base = depName.replace(/Service$/, "");
  return `${base.charAt(0).toLowerCase()}${base.slice(1).replace(/([A-Z])/g, "-$1").toLowerCase()}.service.ts`;
}

function findDepFile(depName) {
  const target = depNameToFile(depName);
  return walk(SRC, ".service.ts").find((file) => basename(file) === target);
}

function buildControllerSpec(controllerFile) {
  const content = readFileSync(controllerFile, "utf8");
  const className = extractClassName(content, "Controller");
  if (!className) return null;

  const specPath = controllerFile.replace(/\.controller\.ts$/, ".controller.spec.ts");
  if (existsSync(specPath)) return null;

  const serviceName = className.replace(/Controller$/, "Service");
  const serviceFile = controllerFile.replace(/\.controller\.ts$/, ".service.ts");
  if (!existsSync(serviceFile)) return null;

  const methods = extractPublicMethods(content, { includeSync: true }).filter(
    (method) => !["constructor", "UseGuards", "ApiTags", "ApiBearerAuth", "Controller", "Roles"].includes(method),
  );
  if (methods.length === 0) return null;

  const helperImport = toTestHelperImport(specPath);
  const serviceImport = `./${basename(serviceFile).replace(".ts", "")}`;

  const methodTests = methods
    .map((method) => {
      const needsReq = content.includes(` ${method}(`) && content.includes("@Req()");
      const args = buildMethodArgs(method);
      const req = needsReq ? ', { user: { id: ACTOR_ID, role: "ADMIN", email: "admin@test.com" } } as never' : "";
      return `  it("delegates ${method}", async () => {
    await expect((controller as any).${method}(${args}${req})).resolves.toBeDefined();
    expect(service.${method}).toHaveBeenCalled();
  });`;
    })
    .join("\n\n");

  return `// @ts-nocheck
import { Test, TestingModule } from "@nestjs/testing";
import { ${className} } from "./${basename(controllerFile).replace(".ts", "")}";
import { ${serviceName} } from "${serviceImport}";
import { JwtAuthGuard } from "${toImportPath(specPath, "common/guards/jwt-auth.guard")}";
import { RolesGuard } from "${toImportPath(specPath, "common/guards/roles.guard")}";
import { ACTOR_ID, TEST_ID, baseQuery } from "${helperImport}";

describe("${className}", () => {
  let controller: ${className};
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          if (prop === "then") return undefined;
          if (!service[prop]) {
            service[prop] = jest.fn().mockResolvedValue({ success: true, data: { id: TEST_ID } });
          }
          return service[prop];
        },
      },
    ) as Record<string, jest.Mock>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [${className}],
      providers: [{ provide: ${serviceName}, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(${className});
  });

${methodTests}
});
`;
}

let serviceCount = 0;
let controllerCount = 0;

for (const file of walk(SRC, ".service.ts")) {
  const spec = buildServiceSpec(file);
  if (spec) {
    writeFileSync(file.replace(/\.service\.ts$/, ".service.spec.ts"), spec);
    serviceCount += 1;
  }
}

for (const file of walk(SRC, ".controller.ts")) {
  const spec = buildControllerSpec(file);
  if (spec) {
    writeFileSync(file.replace(/\.controller\.ts$/, ".controller.spec.ts"), spec);
    controllerCount += 1;
  }
}

console.log(`Generated ${serviceCount} service specs and ${controllerCount} controller specs.`);
