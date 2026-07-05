import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcRoot = path.join(root, "admin-panel", "src");
const destRoot = path.join(root, "frontend", "src");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest, filter) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else if (!filter || filter(srcPath)) {
      copyFile(srcPath, destPath);
    }
  }
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else callback(full);
  }
}

function transformContent(content) {
  let result = content;

  const importReplacements = [
    ["@/components/layout/", "@/components/admin/layout/"],
    ["@/components/dashboard/", "@/components/admin/dashboard/"],
    ["@/components/auth/", "@/components/admin/auth/"],
    ["@/components/users/", "@/components/admin/users/"],
    ["@/components/temples/", "@/components/admin/temples/"],
    ["@/components/festivals/", "@/components/admin/festivals/"],
    ["@/components/deities/", "@/components/admin/deities/"],
    ["@/components/panchang/", "@/components/admin/panchang/"],
    ["@/components/content/", "@/components/admin/content/"],
    ["@/components/media/", "@/components/admin/media/"],
    ["@/components/settings/", "@/components/admin/settings/"],
    ["@/components/rbac/", "@/components/admin/rbac/"],
    ["@/components/notifications/", "@/components/admin/notifications/"],
    ["@/components/audit/", "@/components/admin/audit/"],
    ["@/components/shared/", "@/components/common/"],
    ["@/config/", "@/constants/"],
  ];

  for (const [from, to] of importReplacements) {
    result = result.split(from).join(to);
  }

  const adminRoutePrefixes = [
    "dashboard",
    "users",
    "roles",
    "permissions",
    "content",
    "temples",
    "festivals",
    "deities",
    "panchang",
    "media",
    "notifications",
    "activity-logs",
    "settings",
  ];

  for (const prefix of adminRoutePrefixes) {
    const patterns = [
      [`href="/${prefix}`, `href="/admin/${prefix}`],
      [`href='/${prefix}`, `href='/admin/${prefix}`],
      [`homeHref="/${prefix}`, `homeHref="/admin/${prefix}`],
      [`to="/${prefix}`, `to="/admin/${prefix}`],
      [`"/${prefix}/`, `"/admin/${prefix}/`],
      [`'/${prefix}/`, `'/admin/${prefix}/`],
      [`value: "/${prefix}`, `value: "/admin/${prefix}`],
      [`href: "/${prefix}`, `href: "/admin/${prefix}`],
    ];
    for (const [from, to] of patterns) {
      result = result.split(from).join(to);
    }
  }

  result = result.replace(/href="\/admin\/admin\//g, 'href="/admin/');
  result = result.replace(/href='\/admin\/admin\//g, "href='/admin/");
  result = result.replace(/homeHref="\/admin\/admin\//g, 'homeHref="/admin/');
  result = result.replace(/"\/admin\/admin\//g, '"/admin/');

  return result;
}

function transformFile(filePath) {
  if (!/\.(tsx?|css|json|mjs)$/.test(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  const next = transformContent(content);
  if (next !== content) fs.writeFileSync(filePath, next);
}

console.log("Removing old frontend admin stub...");
removeDir(path.join(destRoot, "app", "admin"));
removeDir(path.join(destRoot, "components", "admin"));
removeDir(path.join(destRoot, "components", "providers.tsx"));

console.log("Copying admin app routes...");
copyDir(
  path.join(srcRoot, "app", "(admin)"),
  path.join(destRoot, "app", "admin"),
);

console.log("Copying auth routes...");
copyDir(
  path.join(srcRoot, "app", "(auth)"),
  path.join(destRoot, "app", "(auth)"),
);

console.log("Copying public landing...");
ensureDir(path.join(destRoot, "app", "(public)"));
const publicLanding = path.join(root, "frontend", "src", "app", "page.tsx");
if (fs.existsSync(publicLanding)) {
  copyFile(publicLanding, path.join(destRoot, "app", "(public)", "page.tsx"));
  fs.unlinkSync(publicLanding);
}

console.log("Copying root app files...");
for (const file of ["error.tsx", "loading.tsx", "not-found.tsx"]) {
  const src = path.join(srcRoot, "app", file);
  if (fs.existsSync(src)) copyFile(src, path.join(destRoot, "app", file));
}

console.log("Copying admin components...");
const adminComponentDirs = [
  "auth",
  "audit",
  "content",
  "dashboard",
  "deities",
  "festivals",
  "layout",
  "media",
  "notifications",
  "panchang",
  "rbac",
  "settings",
  "temples",
  "users",
];
for (const dir of adminComponentDirs) {
  copyDir(
    path.join(srcRoot, "components", dir),
    path.join(destRoot, "components", "admin", dir),
  );
}

console.log("Copying shared/common components...");
copyDir(
  path.join(srcRoot, "components", "shared"),
  path.join(destRoot, "components", "common"),
);

console.log("Copying UI components...");
copyDir(
  path.join(srcRoot, "components", "ui"),
  path.join(destRoot, "components", "ui"),
);

console.log("Copying support directories...");
copyDir(path.join(srcRoot, "providers"), path.join(destRoot, "providers"));
copyDir(path.join(srcRoot, "stores"), path.join(destRoot, "stores"));
copyDir(path.join(srcRoot, "services"), path.join(destRoot, "services"));
copyDir(path.join(srcRoot, "types"), path.join(destRoot, "types"));
copyDir(path.join(srcRoot, "utils"), path.join(destRoot, "utils"));
copyDir(path.join(srcRoot, "styles"), path.join(destRoot, "styles"));
copyDir(path.join(srcRoot, "assets"), path.join(destRoot, "assets"));
copyDir(path.join(srcRoot, "config"), path.join(destRoot, "constants"));

const adminLib = path.join(srcRoot, "lib", "utils.ts");
if (fs.existsSync(adminLib)) {
  copyFile(adminLib, path.join(destRoot, "lib", "utils.ts"));
}

console.log("Copying globals.css and public assets...");
copyFile(path.join(srcRoot, "app", "globals.css"), path.join(destRoot, "app", "globals.css"));
copyDir(path.join(root, "admin-panel", "public"), path.join(root, "frontend", "public"));

console.log("Writing root layout and page...");
copyFile(path.join(srcRoot, "app", "layout.tsx"), path.join(destRoot, "app", "layout.tsx"));

const rootPage = `import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
`;
fs.writeFileSync(path.join(destRoot, "app", "page.tsx"), rootPage);

const adminLayoutSrc = path.join(destRoot, "app", "admin", "layout.tsx");
if (fs.existsSync(adminLayoutSrc)) {
  let layout = fs.readFileSync(adminLayoutSrc, "utf8");
  layout = layout.replace(
    '@/components/layout/admin-layout',
    '@/components/admin/layout/admin-layout',
  );
  fs.writeFileSync(adminLayoutSrc, layout);
}

console.log("Transforming imports and routes...");
walk(destRoot, transformFile);

console.log("Migration copy complete.");
