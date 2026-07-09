export type ApiRecord = Record<string, unknown>;

export function getString(record: ApiRecord, key: string, fallback = "—") {
  const value = record[key];
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export function getBoolean(record: ApiRecord, key: string, fallback = false) {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
}

export function getNumber(record: ApiRecord, key: string, fallback = 0) {
  const value = record[key];
  return typeof value === "number" ? value : fallback;
}

export function formatDateTime(value: unknown) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRelativeTime(value: unknown) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDateTime(date);
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
