// Runs before every build. Pulls blog posts and site settings from Firestore
// (when a service account is available) into content/generated/*.json.
import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "content", "generated");
fs.mkdirSync(out, { recursive: true });
const write = (f, d) => fs.writeFileSync(path.join(out, f), JSON.stringify(d, null, 2));

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.log("[content] No FIREBASE_SERVICE_ACCOUNT, using repo content only.");
  if (!fs.existsSync(path.join(out, "settings.json"))) write("settings.json", {});
  if (!fs.existsSync(path.join(out, "posts.json"))) write("posts.json", []);
  process.exit(0);
}
const { initializeApp, cert } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");
const sa = JSON.parse(raw);
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const sDoc = await db.doc("settings/site").get();
const settings = sDoc.exists ? sDoc.data() : {};
if (!settings.url) settings.url = `https://${sa.project_id}.web.app`;
write("settings.json", settings);

const snap = await db.collection("posts").get();
const toIso = (v) => (v && typeof v.toDate === "function" ? v.toDate().toISOString() : v || null);
const posts = snap.docs
  .map((d) => ({ ...d.data(), id: d.id }))
  .map((p) => ({ ...p, date: toIso(p.date), updated: toIso(p.updated) }));
write("posts.json", posts);
console.log(`[content] ${posts.length} Firestore posts, settings keys: ${Object.keys(settings).join(", ")}`);
