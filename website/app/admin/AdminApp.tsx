"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { firebaseConfig, firebaseReady } from "@/lib/firebase-config";

/* ---------- types ---------- */
type Lead = {
  id: string; source: string; name: string; phone?: string; business?: string; city?: string; needs?: string[];
  stage?: string; when?: string; message?: string; website?: string; page?: string; status: string; notes?: string; createdAt: Date | null;
};
type Post = { id?: string; slug: string; title: string; description: string; keywords: string[]; body: string; faqs?: { q: string; a: string }[]; published: boolean; date: string; source: "admin" | "repo" };
type Settings = Record<string, string>;
type Api = {
  user: { email: string } | null;
  signIn(e: string, p: string): Promise<void>; signOut(): Promise<void>; reset(e: string): Promise<void>;
  leads(): Promise<Lead[]>; updateLead(id: string, d: Partial<Lead>): Promise<void>; deleteLead(id: string): Promise<void>;
  posts(): Promise<Post[]>; savePost(p: Post): Promise<void>; deletePost(id: string): Promise<void>;
  settings(): Promise<Settings>; saveSettings(s: Settings): Promise<void>;
};

const STATUSES = [
  { id: "new", label: "New" }, { id: "contacted", label: "Contacted" }, { id: "quoted", label: "Quote sent" },
  { id: "won", label: "Won" }, { id: "lost", label: "Lost" },
];
const SETTINGS_FIELDS: { key: string; label: string; hint: string; group: string }[] = [
  { key: "whatsapp", label: "WhatsApp number", hint: "Country code + number, digits only. Example: 919876543210", group: "Contact" },
  { key: "phone", label: "Phone (shown on site)", hint: "Example: +91 98765 43210", group: "Contact" },
  { key: "email", label: "Email", hint: "Where clients can email you", group: "Contact" },
  { key: "city", label: "City", hint: "Used for local Google searches. Example: Bhubaneswar", group: "Location" },
  { key: "region", label: "State", hint: "Example: Odisha", group: "Location" },
  { key: "url", label: "Website address", hint: "Your live address, e.g. https://dfetechnology.com (no slash at the end)", group: "Location" },
  { key: "ga4Id", label: "Google Analytics 4 ID", hint: "Starts with G-", group: "Ads & tracking" },
  { key: "googleAdsId", label: "Google Ads tag ID", hint: "Starts with AW-", group: "Ads & tracking" },
  { key: "googleAdsLabel", label: "Google Ads lead conversion label", hint: "From Google Ads → Goals → Conversions → your lead action → Tag setup", group: "Ads & tracking" },
  { key: "metaPixelId", label: "Meta Pixel ID", hint: "15–16 digit number from Meta Events Manager", group: "Ads & tracking" },
];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
const when = (d: Date | null) => (d ? d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "Just now");
const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ---------- Firebase-backed API ---------- */
async function firebaseApi(onUser: (u: { email: string } | null) => void): Promise<Api> {
  const { initializeApp, getApps } = await import("firebase/app");
  const auth = await import("firebase/auth");
  const fs = await import("firebase/firestore");
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const a = auth.getAuth(app);
  const db = fs.getFirestore(app);
  const api: Api = {
    user: null,
    signIn: async (e, p) => { await auth.signInWithEmailAndPassword(a, e, p); },
    signOut: () => auth.signOut(a),
    reset: (e) => auth.sendPasswordResetEmail(a, e),
    leads: async () => {
      const s = await fs.getDocs(fs.query(fs.collection(db, "leads"), fs.orderBy("createdAt", "desc"), fs.limit(500)));
      return s.docs.map((d) => { const x = d.data(); return { ...(x as Lead), id: d.id, createdAt: x.createdAt?.toDate?.() ?? null }; });
    },
    updateLead: (id, d) => fs.updateDoc(fs.doc(db, "leads", id), { ...d, updatedAt: fs.serverTimestamp() }),
    deleteLead: (id) => fs.deleteDoc(fs.doc(db, "leads", id)),
    posts: async () => {
      const s = await fs.getDocs(fs.collection(db, "posts"));
      return s.docs.map((d) => { const x = d.data(); return { ...(x as Post), id: d.id, source: "admin" as const, date: x.date?.toDate?.()?.toISOString?.() ?? x.date ?? "" }; });
    },
    savePost: async (p) => {
      const id = p.id || p.slug;
      const { source: _s, id: _i, ...rest } = p; void _s; void _i;
      await fs.setDoc(fs.doc(db, "posts", id), { ...rest, updated: new Date().toISOString() }, { merge: true });
    },
    deletePost: (id) => fs.deleteDoc(fs.doc(db, "posts", id)),
    settings: async () => { const s = await fs.getDoc(fs.doc(db, "settings", "site")); return (s.data() as Settings) || {}; },
    saveSettings: (s) => fs.setDoc(fs.doc(db, "settings", "site"), s, { merge: true }),
  };
  auth.onAuthStateChanged(a, (u) => onUser(u ? { email: u.email || "" } : null));
  return api;
}

/* ---------- Demo API (preview without Firebase) ---------- */
function demoApi(): Api {
  const now = Date.now();
  let leads: Lead[] = [
    { id: "1", source: "project", name: "Sample: Priya", phone: "9876543210", business: "Sample Jewellers", city: "Bhubaneswar", needs: ["Online store", "Digital marketing"], stage: "Just an idea", when: "This month", message: "Sample enquiry for the demo.", status: "new", createdAt: new Date(now - 36e5) },
    { id: "2", source: "audit", name: "Sample: Rahul", website: "www.example.com", status: "contacted", notes: "Sent audit on WhatsApp", createdAt: new Date(now - 864e5) },
    { id: "3", source: "project", name: "Sample: Anita", needs: ["Mobile app"], stage: "Need a redesign", when: "This week", status: "quoted", createdAt: new Date(now - 3 * 864e5) },
  ];
  let posts: Post[] = [];
  let settings: Settings = {};
  return {
    user: { email: "demo@dfe" },
    signIn: async () => {}, signOut: async () => {}, reset: async () => {},
    leads: async () => leads, updateLead: async (id, d) => { leads = leads.map((l) => (l.id === id ? { ...l, ...d } : l)); },
    deleteLead: async (id) => { leads = leads.filter((l) => l.id !== id); },
    posts: async () => posts, savePost: async (p) => { posts = [...posts.filter((x) => x.slug !== p.slug), { ...p, source: "admin" }]; },
    deletePost: async (id) => { posts = posts.filter((p) => (p.id || p.slug) !== id); },
    settings: async () => settings, saveSettings: async (s) => { settings = { ...settings, ...s }; },
  };
}

/* ---------- App ---------- */
export default function AdminApp() {
  const [api, setApi] = useState<Api | null>(null);
  const [user, setUser] = useState<{ email: string } | null | undefined>(undefined);
  const [tab, setTab] = useState<"leads" | "blog" | "settings">("leads");
  const [demo, setDemo] = useState(false);
  const [toast, setToast] = useState("");
  const say = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); }, []);

  useEffect(() => {
    const isDemo = location.hash === "#demo" || !firebaseReady();
    setDemo(isDemo);
    if (isDemo) { const d = demoApi(); setApi(d); setUser(d.user); return; }
    firebaseApi(setUser).then(setApi).catch(() => say("Couldn't connect to Firebase. Check the config."));
  }, [say]);

  if (!api || user === undefined) return <div className="adm-center"><div className="spin" aria-label="Loading" /></div>;
  if (!user) return <Login api={api} />;

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <a href={`${bp}/`} className="adm-logo"><img src={`${bp}/logo-light.png`} alt="DFE Technology" height={30} /><span>Admin</span></a>
        <nav className="adm-tabs" aria-label="Admin sections">
          {(["leads", "blog", "settings"] as const).map((t) => (
            <button key={t} className={tab === t ? "on" : ""} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)}>{t === "leads" ? "Leads" : t === "blog" ? "Blog" : "Settings"}</button>
          ))}
        </nav>
        <button className="adm-link" onClick={() => api.signOut()}>{demo ? "Demo" : "Sign out"}</button>
      </header>
      {demo && <p className="adm-banner">Preview mode with sample data. Connect Firebase to see real enquiries.</p>}
      <main className="adm-main">
        {tab === "leads" && <Leads api={api} say={say} />}
        {tab === "blog" && <Blog api={api} say={say} />}
        {tab === "settings" && <SettingsView api={api} say={say} />}
      </main>
      <nav className="adm-bottom" aria-label="Admin sections">
        {(["leads", "blog", "settings"] as const).map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{t === "leads" ? <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /> : t === "blog" ? <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /> : <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />}</svg>
            {t === "leads" ? "Leads" : t === "blog" ? "Blog" : "Settings"}
          </button>
        ))}
      </nav>
      {toast && <div className="adm-toast" role="status">{toast}</div>}
    </div>
  );
}

function Login({ api }: { api: Api }) {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [info, setInfo] = useState("");
  return (
    <div className="adm-center">
      <form className="adm-login" onSubmit={async (e) => {
        e.preventDefault(); const d = new FormData(e.currentTarget); setBusy(true); setErr("");
        try { await api.signIn(String(d.get("email")), String(d.get("password"))); }
        catch { setErr("Email or password is wrong. Check both and try again."); }
        setBusy(false);
      }}>
        <img src={`${bp}/logo-light.png`} alt="DFE Technology" height={40} style={{ margin: "0 auto 6px" }} />
        <h1>Sign in to admin</h1>
        <label>Email<input className="inp" name="email" type="email" autoComplete="username" required /></label>
        <label>Password<input className="inp" name="password" type="password" autoComplete="current-password" required /></label>
        {err && <p className="err" role="alert">{err}</p>}
        {info && <p className="adm-ok">{info}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <button type="button" className="adm-link" onClick={async (e) => {
          const email = (e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement)?.value;
          if (!email) { setErr("Enter your email first, then tap Forgot password."); return; }
          try { await api.reset(email); setInfo("Password reset email sent. Check your inbox."); setErr(""); } catch { setErr("Couldn't send the reset email. Check the address."); }
        }}>Forgot password?</button>
      </form>
    </div>
  );
}

/* ---------- Leads ---------- */
function Leads({ api, say }: { api: Api; say: (m: string) => void }) {
  const [list, setList] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const load = useCallback(() => api.leads().then(setList).catch(() => say("Couldn't load leads. Check you're signed in as the admin.")), [api, say]);
  useEffect(() => { load(); }, [load]);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s.id, (list || []).filter((l) => (l.status || "new") === s.id).length])), [list]);
  const shown = (list || []).filter((l) => (filter === "all" || (l.status || "new") === filter) && (!q || JSON.stringify(l).toLowerCase().includes(q.toLowerCase())));

  const update = async (id: string, d: Partial<Lead>) => { await api.updateLead(id, d); setList((v) => (v || []).map((l) => (l.id === id ? { ...l, ...d } : l))); say("Saved"); };
  const exportCsv = () => {
    const cols = ["createdAt", "name", "phone", "business", "city", "needs", "stage", "when", "website", "message", "status", "notes"];
    const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join("; ") : v instanceof Date ? v.toISOString() : v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...(list || []).map((l) => cols.map((c) => esc((l as Record<string, unknown>)[c])).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "dfe-leads.csv"; a.click();
  };

  return (
    <section>
      <div className="adm-head">
        <div><h2>Leads</h2><p>{list ? `${list.length} enquiries · ${counts.new || 0} new` : "Loading…"}</p></div>
        <div className="adm-actions"><button className="btn btn-line sm" onClick={load}>Refresh</button><button className="btn btn-line sm" onClick={exportCsv} disabled={!list?.length}>Export CSV</button></div>
      </div>
      <div className="adm-filters" role="tablist">
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All <b>{list?.length || 0}</b></button>
        {STATUSES.map((s) => <button key={s.id} className={filter === s.id ? "on" : ""} onClick={() => setFilter(s.id)}>{s.label} <b>{counts[s.id] || 0}</b></button>)}
      </div>
      <input className="inp adm-search" placeholder="Search name, city, need…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
      {list && shown.length === 0 && <div className="adm-empty"><h3>{list.length ? "No leads match" : "No enquiries yet"}</h3><p>{list.length ? "Try another filter or search." : "When someone uses a form on your website, it shows up here."}</p></div>}
      <div className="adm-list">
        {shown.map((l) => {
          const st = l.status || "new"; const isOpen = open === l.id;
          const phone = (l.phone || "").replace(/\D/g, ""); const wa = phone ? (phone.length === 10 ? "91" + phone : phone) : "";
          return (
            <article key={l.id} className={`lead st-${st}`}>
              <button className="lead-top" onClick={() => setOpen(isOpen ? null : l.id)} aria-expanded={isOpen}>
                <span className="dot" aria-hidden />
                <span className="who"><b>{l.name || "No name"}</b><small>{l.source === "audit" ? `Audit · ${l.website}` : (l.needs || []).join(", ") || "Project"}{l.city ? ` · ${l.city}` : ""}</small></span>
                <time>{when(l.createdAt)}</time>
              </button>
              {isOpen && (
                <div className="lead-body">
                  <dl>
                    {l.business && <><dt>Business</dt><dd>{l.business}</dd></>}
                    {l.phone && <><dt>WhatsApp</dt><dd>{l.phone}</dd></>}
                    {l.stage && <><dt>Stage</dt><dd>{l.stage}</dd></>}
                    {l.when && <><dt>Start</dt><dd>{l.when}</dd></>}
                    {l.website && <><dt>Website</dt><dd>{l.website}</dd></>}
                    {l.message && <><dt>Message</dt><dd>{l.message}</dd></>}
                    {l.page && <><dt>Came from</dt><dd>{l.page}</dd></>}
                  </dl>
                  <label className="adm-field">Status
                    <select className="inp" value={st} onChange={(e) => update(l.id, { status: e.target.value })}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                  </label>
                  <label className="adm-field">Notes
                    <textarea className="inp" defaultValue={l.notes || ""} placeholder="Call notes, quote amount, next step…" onBlur={(e) => e.target.value !== (l.notes || "") && update(l.id, { notes: e.target.value })} />
                  </label>
                  <div className="adm-actions">
                    {wa && <a className="btn btn-primary sm" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${l.name}, this is DFE Technology. Thanks for your enquiry!`)}`} target="_blank" rel="noopener">WhatsApp</a>}
                    {phone && <a className="btn btn-line sm" href={`tel:${phone}`}>Call</a>}
                    <button className="btn btn-line sm danger" onClick={async () => { if (window.confirm(`Delete the lead from ${l.name}? This can't be undone.`)) { await api.deleteLead(l.id); setList((v) => (v || []).filter((x) => x.id !== l.id)); say("Lead deleted"); } }}>Delete</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Blog ---------- */
const emptyPost = (): Post => ({ slug: "", title: "", description: "", keywords: [], body: "", faqs: [], published: true, date: new Date().toISOString(), source: "admin" });

function Blog({ api, say }: { api: Api; say: (m: string) => void }) {
  const [admin, setAdmin] = useState<Post[] | null>(null);
  const [repo, setRepo] = useState<Post[]>([]);
  const [edit, setEdit] = useState<Post | null>(null);
  const load = useCallback(async () => {
    try { setAdmin(await api.posts()); } catch { setAdmin([]); say("Couldn't load your posts."); }
    try { const r = await fetch(`${bp}/blog-index.json`); if (r.ok) setRepo((await r.json()).filter((p: Post) => p.source === "repo").map((p: Post) => ({ ...p, published: true }))); } catch { /* offline */ }
  }, [api, say]);
  useEffect(() => { load(); }, [load]);
  if (edit) return <Editor post={edit} onClose={() => { setEdit(null); load(); }} api={api} say={say} />;
  const adminSlugs = new Set((admin || []).map((p) => p.slug));
  const all = [...(admin || []), ...repo.filter((p) => !adminSlugs.has(p.slug))].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <section>
      <div className="adm-head">
        <div><h2>Blog</h2><p>{all.length} articles · new auto-articles every Mon, Wed and Fri</p></div>
        <button className="btn btn-primary sm" onClick={() => setEdit(emptyPost())}>New article</button>
      </div>
      <p className="adm-note">Changes go live on the next site update, which runs every hour.</p>
      {admin && all.length === 0 && <div className="adm-empty"><h3>No articles yet</h3><p>Write your first one, or wait for the automatic articles.</p></div>}
      <div className="adm-list">
        {all.map((p) => (
          <article key={p.slug} className="post-row">
            <div><b>{p.title}</b><small>{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {p.source === "repo" ? "Auto-blog" : p.published ? "Published" : "Hidden"}</small></div>
            <button className="btn btn-line sm" onClick={() => setEdit({ ...p })}>Edit</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Editor({ post, onClose, api, say }: { post: Post; onClose: () => void; api: Api; say: (m: string) => void }) {
  const [p, setP] = useState<Post>(post);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isNew = !post.slug;
  const set = (k: keyof Post, v: unknown) => setP((x) => ({ ...x, [k]: v }));
  const save = async () => {
    if (!p.title.trim()) { setErr("Add a title."); return; }
    if (p.body.trim().length < 50) { setErr("The article is too short. Write at least a few paragraphs."); return; }
    const slug = slugify(p.slug || p.title);
    setBusy(true); setErr("");
    try { await api.savePost({ ...p, slug, id: p.id || slug, source: "admin" }); say(p.source === "repo" ? "Saved your edited copy" : "Article saved"); onClose(); }
    catch { setErr("Couldn't save. Check you're signed in as the admin."); }
    setBusy(false);
  };
  return (
    <section className="editor">
      <div className="adm-head">
        <button className="adm-link" onClick={onClose}>‹ All articles</button>
        <div className="adm-actions">
          <button className="btn btn-line sm" onClick={() => setPreview(!preview)}>{preview ? "Edit" : "Preview"}</button>
          <button className="btn btn-primary sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
      {post.source === "repo" && <p className="adm-note">This article was written by the auto-blog. Saving creates your edited copy, which replaces it on the site.</p>}
      {err && <p className="err" role="alert">{err}</p>}
      {preview ? (
        <article className="adm-preview"><h1>{p.title}</h1><p className="lede">{p.description}</p><div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(p.body || "", { async: false }) as string }} /></article>
      ) : (
        <div className="adm-form">
          <label className="adm-field">Title<input className="inp" value={p.title} onChange={(e) => { set("title", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }} placeholder="How much does an app cost in India?" /></label>
          <label className="adm-field">Web address<span className="adm-slug">/blog/<input className="inp" value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} disabled={!isNew} /></span></label>
          <label className="adm-field">Summary for Google (1–2 sentences)<textarea className="inp" rows={2} maxLength={180} value={p.description} onChange={(e) => set("description", e.target.value)} /><small>{p.description.length}/160 characters</small></label>
          <label className="adm-field">Keywords (comma separated)<input className="inp" value={p.keywords.join(", ")} onChange={(e) => set("keywords", e.target.value.split(",").map((k) => k.trim()).filter(Boolean))} placeholder="app development cost, android app" /></label>
          <label className="adm-field">Article (Markdown: ## for headings, **bold**, - for lists)<textarea className="inp mono" rows={18} value={p.body} onChange={(e) => set("body", e.target.value)} /></label>
          <label className="adm-check"><input type="checkbox" checked={p.published} onChange={(e) => set("published", e.target.checked)} /> Show on website</label>
          {p.id && p.source === "admin" && (
            <button className="btn btn-line sm danger" style={{ justifySelf: "start" }} onClick={async () => { if (window.confirm("Delete this article? This can't be undone.")) { await api.deletePost(p.id!); say("Article deleted"); onClose(); } }}>Delete article</button>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------- Settings ---------- */
function SettingsView({ api, say }: { api: Api; say: (m: string) => void }) {
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.settings().then(setS).catch(() => { setS({}); say("Couldn't load settings."); }); }, [api, say]);
  if (!s) return <div className="spin" />;
  const groups = [...new Set(SETTINGS_FIELDS.map((f) => f.group))];
  return (
    <section>
      <div className="adm-head"><div><h2>Settings</h2><p>Your contact details, location and ad tracking IDs.</p></div></div>
      <p className="adm-note">Saved changes go live on the next site update, which runs every hour.</p>
      <form className="adm-form" onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { await api.saveSettings(s); say("Settings saved"); } catch { say("Couldn't save settings."); } setBusy(false); }}>
        {groups.map((g) => (
          <fieldset key={g} className="adm-group"><legend>{g}</legend>
            {SETTINGS_FIELDS.filter((f) => f.group === g).map((f) => (
              <label key={f.key} className="adm-field">{f.label}<input className="inp" value={s[f.key] || ""} onChange={(e) => setS({ ...s, [f.key]: e.target.value.trim() })} /><small>{f.hint}</small></label>
            ))}
          </fieldset>
        ))}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
      </form>
    </section>
  );
}
