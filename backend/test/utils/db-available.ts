export function isE2eDatabaseAvailable() {
  return process.env.E2E_DB_AVAILABLE === "true";
}

export function describeWithDb(name: string, fn: () => void) {
  if (isE2eDatabaseAvailable()) {
    describe(name, fn);
    return;
  }

  describe.skip(`${name} (database unavailable)`, fn);
}
