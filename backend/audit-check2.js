const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const models = [...schema.matchAll(/^model (\w+)/gm)].map((m) => m[1]);
const toCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const used = new Set();
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".ts")) {
      const text = fs.readFileSync(p, "utf8");
      for (const m of [...text.matchAll(/prisma\.(\w+)/g)]) used.add(m[1]);
    }
  }
}
walk("src");

const missing = models.filter((m) => !used.has(toCamel(m)));

const app = fs.readFileSync("src/app.module.ts", "utf8");
const registered = new Set([...app.matchAll(/from "\.\/modules\/([^/]+)\//g)].map((m) => m[1]));
const moduleDirs = fs
  .readdirSync("src/modules", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const dead = moduleDirs.filter(
  (d) => !registered.has(d) && !d.endsWith("-child-common") && !d.endsWith("-common"),
);

const routes = {};
function walkControllers(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkControllers(p);
    else if (f.endsWith(".controller.ts")) {
      const text = fs.readFileSync(p, "utf8");
      const m = text.match(/@Controller\("([^"]+)"\)/);
      if (m) {
        routes[m[1]] = routes[m[1]] || [];
        routes[m[1]].push(p.replace(/\\/g, "/"));
      }
    }
  }
}
walkControllers("src/modules");
const dupes = Object.entries(routes).filter(([, v]) => v.length > 1);

const noJwt = [];
walkControllers2("src/modules");
function walkControllers2(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkControllers2(p);
    else if (f.endsWith(".controller.ts")) {
      const text = fs.readFileSync(p, "utf8");
      if (!text.includes("JwtAuthGuard") && !p.includes("health")) noJwt.push(p.replace(/\\/g, "/"));
    }
  }
}

console.log(JSON.stringify({ modelCount: models.length, missingModels: missing, deadModules: dead, duplicateRoutes: dupes, controllersWithoutJwt: noJwt }, null, 2));
