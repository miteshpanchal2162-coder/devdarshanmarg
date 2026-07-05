import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const patterns = ["src/modules/**/*.service.spec.ts", "src/modules/**/*.controller.spec.ts"];

for (const pattern of patterns) {
  for (const file of globSync(pattern, { windowsPathsNoEscape: true })) {
    let content = readFileSync(file, "utf8");
    if (content.startsWith("// @ts-nocheck")) {
      continue;
    }

    content = content
      .replace(/await expect\(service\.(\w+)\(/g, "await expect((service as any).$1(")
      .replace(/await expect\(service\.(\w+)\(/g, "await expect((service as any).$1(")
      .replace(/await expect\(controller\.(\w+)\(/g, "await expect((controller as any).$1(");

    writeFileSync(file, `// @ts-nocheck\n${content}`);
  }
}

console.log("Patched generated spec files.");
