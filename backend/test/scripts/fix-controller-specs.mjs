import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const brokenProxy = `    service = new Proxy(
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
    ) as Record<string, jest.Mock>;`;

const fixedProxy = `    const serviceMocks: Record<string, jest.Mock> = {};
    service = new Proxy(serviceMocks, {
      get(target, prop: string) {
        if (prop === "then") return undefined;
        if (!target[prop]) {
          target[prop] = jest.fn().mockResolvedValue({ success: true, data: { id: TEST_ID } });
        }
        return target[prop];
      },
    }) as Record<string, jest.Mock>;`;

for (const file of globSync("src/modules/**/*.controller.spec.ts", { windowsPathsNoEscape: true })) {
  const content = readFileSync(file, "utf8");
  if (content.includes(brokenProxy)) {
    writeFileSync(file, content.replace(brokenProxy, fixedProxy));
  }
}

console.log("Fixed controller spec proxies.");
