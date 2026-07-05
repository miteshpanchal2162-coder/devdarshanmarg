const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const models = [...schema.matchAll(/^model (\w+)/gm)].map((m) => m[1]);
const modulesDir = "src/modules";
const moduleFolders = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const app = fs.readFileSync("src/app.module.ts", "utf8");
const regImports = [...app.matchAll(/from "\.\/modules\/([^"]+)"/g)].map((m) =>
  m[1].split("/").pop(),
);

const map = {
  SupportedMediaType: "supported-media-types",
  SupportedContentStatus: "supported-content-statuses",
  SupportedLanguage: "supported-languages",
  TempleDeityMap: "temple-deity-maps",
  TempleCategoryMap: "temple-category-maps",
  DeityCategoryMap: "deity-category-maps",
  FestivalCategoryMap: "festival-category-maps",
  FestivalDeityMap: "deity-festivals",
  FestivalTempleMap: "festival-temple-maps",
  ContentTagMap: "content-tag-maps",
  ContentEntityMap: "content-entity-maps",
  ContentEntityType: "content-entity-types",
  ContentItemType: "content-item-types",
  ContentItemTranslation: "content-item-translations",
  ContentType: "content-types",
  ContentPublishLog: "content-publish-logs",
  ContentRelatedItem: "content-related-items",
  ContentGalleryItem: "content-gallery-items",
  ContentItem: "content-items",
  UserNotificationPreference: "user-notification-preferences",
  OtpVerification: "otp-verifications",
  UserSession: "user-sessions",
  RefreshToken: "refresh-tokens",
  ActivityLog: "activity-logs",
  UserProfile: "user-profiles",
  UserFavorite: "user-favorites",
  UserReview: "user-reviews",
  UserRating: "user-ratings",
  UserComment: "user-comments",
  MediaLibrary: "media-library",
  SeoRedirect: "seo-redirects",
  SeoLandingPage: "seo-landing-pages",
  PanchangCategoryMap: "panchang-category-maps",
  PanchangDayElement: "panchang-day-elements",
  PanchangPlanetPosition: "panchang-planet-positions",
  PanchangRashiTransit: "panchang-rashi-transits",
  PanchangExternalLink: "panchang-external-links",
  PanchangChangeHistory: "panchang-change-history",
  RahuKaal: "rahu-kaal",
  GulikaKaal: "gulika-kaal",
  YamagandaKaal: "yamaganda-kaal",
  AbhijitMuhurat: "abhijit-muhurat",
  VratFoodRule: "vrat-food-rules",
  VratBenefit: "vrat-benefits",
  VratRule: "vrat-rules",
  VratDate: "vrat-dates",
  TempleLiveDarshan: "temple-live-darshan",
  TempleExternalLink: "temple-external-links",
  TempleQrCode: "temple-qr-codes",
  TempleChangeHistory: "temple-change-history",
  TemplePilgrimTip: "temple-pilgrim-tips",
  TempleDarshanType: "temple-darshan-types",
  TempleSpecialEvent: "temple-special-events",
  DeityExternalLink: "deity-external-links",
  DeityChangeHistory: "deity-change-history",
  ContentAttachment: "content-attachments",
  User: "users",
};

function toKebab(s) {
  return s.replace(/([A-Z])/g, (m, _p, i) => (i ? "-" : "") + m.toLowerCase());
}

function modelToModule(model) {
  if (map[model]) return map[model];
  let base = toKebab(model);
  if (base.endsWith("y")) base = base.slice(0, -1) + "ies";
  else if (!base.endsWith("s")) base = base + "s";
  return base;
}

const missing = [];
for (const m of models) {
  const mod = modelToModule(m);
  if (!moduleFolders.includes(mod)) missing.push({ model: m, expected: mod });
}

const unreg = moduleFolders.filter((m) => !regImports.includes(m));

// duplicate routes
const controllers = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".controller.ts")) controllers.push(p);
  }
}
walk(modulesDir);
const routes = [];
for (const c of controllers) {
  const text = fs.readFileSync(c, "utf8");
  const m = text.match(/@Controller\("([^"]+)"\)/);
  if (m) routes.push({ file: c, route: m[1] });
}
const routeCounts = {};
for (const r of routes) {
  routeCounts[r.route] = (routeCounts[r.route] || []).concat ? routeCounts[r.route] : [];
  if (!Array.isArray(routeCounts[r.route])) routeCounts[r.route] = [routeCounts[r.route]];
  routeCounts[r.route].push(r.file);
}
const dupes = Object.entries(routeCounts).filter(([, files]) => files.length > 1);

console.log(JSON.stringify({ totalModels: models.length, missing, unreg, dupes: dupes.map(([r,f])=>({route:r,files:f})), totalModules: moduleFolders.length, registered: regImports.length }, null, 2));
