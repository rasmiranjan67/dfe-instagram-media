// ============================================================
//  DFE Technology — default site settings.
//  Values saved in the admin panel (Settings) override these at build time.
// ============================================================
import generated from "../content/generated/settings.json";

const defaults = {
  name: "DFE Technology",
  legalName: "DFE Technology",
  // Final public address of the site (no trailing slash). Change when you buy a domain.
  url: "https://dfe-technology.web.app",
  // Contact — digits only for WhatsApp (country code first, e.g. 919876543210)
  whatsapp: "WHATSAPP_NUMBER",
  phone: "PHONE_NUMBER", // e.g. +91 98765 43210
  email: "EMAIL_ADDRESS",
  // Location — used for local SEO ("near me" and city searches)
  city: "",
  region: "",
  country: "India",
  countryCode: "IN",
  instagram: "https://www.instagram.com/dfe_technology/",
  tagline: "Websites, apps, games and digital marketing built to grow your business.",
  description:
    "DFE Technology is a digital agency in India that builds fast, SEO-ready websites, Android and iOS apps and games, and runs digital marketing (social media, Meta and Google ads, SEO) that brings businesses more enquiries.",
  // Ads & analytics (set in admin → Settings)
  ga4Id: "",          // G-XXXXXXX
  googleAdsId: "",    // AW-XXXXXXXXX
  googleAdsLabel: "", // conversion label for leads
  metaPixelId: "",    // 15-16 digit number
};
type Settings = typeof defaults;
const g = generated as Partial<Settings>;
const clean = Object.fromEntries(Object.entries(g).filter(([, v]) => typeof v === "string" && v.trim() !== "")) as Partial<Settings>;
export const site: Settings = { ...defaults, ...clean, url: (clean.url || defaults.url).replace(/\/$/, "") };

export const place = () => (site.city ? `${site.city}, ${site.country}` : site.country);
export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type Service = {
  slug: string;
  short: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  answer: string; // answer-first paragraph for search + AI engines
  intro: string;
  offers: { title: string; text: string }[];
  forWho: string[];
  stack: string[];
  faqs: { q: string; a: string }[];
  waText: string;
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "website-development",
    short: "Websites",
    name: "Website Development",
    h1: "Website development that turns visitors into customers",
    metaTitle: "Website Development Company in India | Fast, SEO-Ready Websites",
    metaDescription:
      "DFE Technology builds fast, mobile-first, SEO-ready business websites, online stores and landing pages with WhatsApp enquiry built in. Get a fixed quote today.",
    answer:
      "DFE Technology is a website development company in India that designs and builds fast, mobile-first business websites, e-commerce stores and landing pages. Every site includes SEO setup, WhatsApp and enquiry buttons, Google Analytics and a fixed quote before work starts.",
    intro:
      "Your website is often the first thing a customer sees. We build sites that load fast on any phone, show up on Google, and make it effortless for visitors to contact you.",
    offers: [
      { title: "Business websites", text: "A professional site that explains what you do, builds trust and brings in enquiries." },
      { title: "E-commerce stores", text: "Online stores with payments, product management, order tracking and delivery integration." },
      { title: "Landing pages", text: "Focused pages for ads and campaigns, built to convert visitors into leads." },
      { title: "Redesigns", text: "Turn an old, slow site into a modern one, without losing your Google rankings." },
      { title: "SEO built in", text: "Clean code, schema markup, sitemaps, speed optimisation and Google Search Console setup." },
      { title: "Care after launch", text: "Hosting help, updates, backups and changes whenever you need them." },
    ],
    forWho: ["Local businesses and shops", "Startups launching a product", "Clinics, schools and coaching centres", "Brands selling online"],
    stack: ["Next.js", "React", "WordPress", "Shopify", "WooCommerce", "Tailwind CSS"],
    faqs: [
      { q: "How much does a website cost in India?", a: "It depends on the size and features. A simple business website costs far less than a full online store or a custom web app. Tell us what you need and DFE Technology will send a fixed quote, with no obligation." },
      { q: "How long does it take to build a website?", a: "A simple business website can be ready within days; larger sites and online stores take a few weeks. You get an exact timeline with your quote." },
      { q: "Will my website be mobile-friendly and SEO-ready?", a: "Yes. Every website DFE Technology builds is mobile-first and includes on-page SEO, schema markup, a sitemap and speed optimisation as standard." },
    ],
    waText: "Hi DFE Technology! I'm interested in a website.",
    keywords: ["website development company", "website design India", "ecommerce website development", "business website", "landing page design"],
  },
  {
    slug: "app-development",
    short: "Apps",
    name: "Mobile App Development",
    h1: "Mobile app development for Android and iOS",
    metaTitle: "Mobile App Development Company in India | Android & iOS Apps",
    metaDescription:
      "DFE Technology builds Android and iOS apps for bookings, ordering, delivery, loyalty and business tools, from idea to Play Store and App Store launch.",
    answer:
      "DFE Technology is a mobile app development company in India that builds Android and iOS apps, from the first idea and design to Play Store and App Store launch, with admin dashboards and ongoing support.",
    intro:
      "Got an app idea, or need an app for your business? We plan it with you, design screens your customers will enjoy, build it, and launch it on both stores.",
    offers: [
      { title: "Android & iOS apps", text: "One codebase for both platforms with Flutter or React Native, or fully native when needed." },
      { title: "Booking & ordering apps", text: "Appointments, food and grocery ordering, deliveries, with payments built in." },
      { title: "Business & admin tools", text: "Dashboards and internal apps that save your team time." },
      { title: "UI/UX design", text: "Clickable prototypes so you can see and test the app before development starts." },
      { title: "Store launch", text: "We handle Play Store and App Store listings, review and release." },
      { title: "Maintenance", text: "Updates, new features, bug fixes and OS-version support after launch." },
    ],
    forWho: ["Startups with a new idea", "Restaurants, salons and clinics", "E-commerce brands", "Businesses digitising operations"],
    stack: ["Flutter", "React Native", "Kotlin", "Swift", "Firebase", "Node.js"],
    faqs: [
      { q: "How much does it cost to build an app?", a: "App cost depends on screens, features and integrations. DFE Technology breaks it into clear phases and gives a fixed quote so you know the budget before starting." },
      { q: "Do you build for both Android and iOS?", a: "Yes. We usually build one cross-platform app with Flutter or React Native that runs on both, which saves time and cost." },
      { q: "Will you publish the app on the Play Store and App Store?", a: "Yes. We prepare the listings, screenshots and builds, and manage the review process until your app is live." },
    ],
    waText: "Hi DFE Technology! I have an app idea I'd like to discuss.",
    keywords: ["app development company", "android app development", "ios app development", "flutter app development", "mobile app developers India"],
  },
  {
    slug: "game-development",
    short: "Games",
    name: "Game Development",
    h1: "Game development for mobile and web",
    metaTitle: "Game Development Company in India | Mobile & Web Games",
    metaDescription:
      "DFE Technology designs and develops mobile games, web games and branded mini-games with Unity and modern web tech, from concept art to launch.",
    answer:
      "DFE Technology is a game development studio in India that designs and builds mobile games, browser games and branded mini-games using Unity and web technologies, covering game design, art, development and store launch.",
    intro:
      "From casual mobile games to branded games that get customers playing with your business, we take your game from concept to launch.",
    offers: [
      { title: "Mobile games", text: "Casual and hyper-casual games for Android and iOS." },
      { title: "Web & HTML5 games", text: "Games that run instantly in the browser, no download needed." },
      { title: "Branded mini-games", text: "Playable campaigns that boost engagement and capture leads." },
      { title: "Game art & UI", text: "Characters, environments, icons and menus in a consistent style." },
      { title: "Monetisation", text: "Ads, in-app purchases and rewarded videos set up properly." },
      { title: "Launch & updates", text: "Store publishing, analytics and live updates after release." },
    ],
    forWho: ["Indie founders with a game idea", "Brands running campaigns", "EdTech and learning companies", "Event and promotion teams"],
    stack: ["Unity", "C#", "Three.js", "Phaser", "Blender", "Firebase"],
    faqs: [
      { q: "What kind of games does DFE Technology make?", a: "Mobile games for Android and iOS, browser games, and branded or educational mini-games." },
      { q: "Which engine do you use?", a: "Mostly Unity for mobile games, and Three.js or Phaser for web games, chosen to suit your idea and budget." },
      { q: "Can you help monetise my game?", a: "Yes. We set up ads, rewarded videos and in-app purchases, and connect analytics so you can see what's working." },
    ],
    waText: "Hi DFE Technology! I want to build a game.",
    keywords: ["game development company", "mobile game development", "unity game developers", "html5 game development", "branded games"],
  },
  {
    slug: "digital-marketing",
    short: "Marketing",
    name: "Digital Marketing",
    h1: "Digital marketing that brings real enquiries",
    metaTitle: "Digital Marketing Agency in India | Social Media, Ads & SEO",
    metaDescription:
      "DFE Technology runs social media marketing, Instagram reels, Meta and Google ads and SEO for businesses that want more leads and sales, with clear monthly reports.",
    answer:
      "DFE Technology is a digital marketing agency in India offering social media management, Instagram and reels content, Meta (Facebook and Instagram) ads, Google ads and SEO, focused on generating leads and sales with simple monthly reporting.",
    intro:
      "Likes are nice; customers are better. We plan content and campaigns around one goal: more people contacting and buying from you.",
    offers: [
      { title: "Social media management", text: "Content calendars, posts, reels and community replies on Instagram and Facebook." },
      { title: "Meta & Instagram ads", text: "Lead and sales campaigns with careful targeting and creative testing." },
      { title: "Google ads", text: "Search and Performance Max campaigns that reach people actively looking for you." },
      { title: "SEO", text: "Keyword research, on-page fixes, content and Google Business Profile optimisation." },
      { title: "Content & reels", text: "Short videos and designs made for today's trends and your brand." },
      { title: "Reporting", text: "A plain-language report each month showing leads, cost and what's next." },
    ],
    forWho: ["Local businesses wanting more walk-ins", "D2C and e-commerce brands", "Service businesses needing leads", "New brands building awareness"],
    stack: ["Meta Ads", "Google Ads", "Google Search Console", "Google Analytics 4", "Google Business Profile", "Canva & Adobe"],
    faqs: [
      { q: "Which digital marketing services does DFE Technology offer?", a: "Social media management, reels and content creation, Meta and Instagram ads, Google ads, SEO and Google Business Profile optimisation." },
      { q: "How soon will I see results?", a: "Paid ads can bring enquiries within days of launch. SEO builds over a few months. We set clear goals and report progress every month." },
      { q: "Do I need a website for digital marketing?", a: "It helps a lot. Ads and SEO work best when they lead to a fast page built to convert, which DFE Technology can build too." },
    ],
    waText: "Hi DFE Technology! I want more customers through digital marketing.",
    keywords: ["digital marketing agency", "social media marketing", "instagram marketing", "seo services", "google ads agency", "meta ads agency"],
  },
];

export const homeFaqs = [
  { q: "What does DFE Technology do?", a: "DFE Technology builds websites, mobile apps and games, and runs digital marketing (social media, Meta and Google ads, SEO) for businesses that want to grow online. Design, development and marketing are handled by one team." },
  { q: "How do I get a quote?", a: "Use the project form or message DFE Technology on WhatsApp with what you need. You'll get a plan and a fixed quote before any work starts." },
  { q: "Do you work with businesses outside your city?", a: "Yes. DFE Technology works with clients across India and abroad over WhatsApp, calls and video meetings." },
  { q: "Can I update my website myself?", a: "Yes. Sites can be set up so you edit text, photos and products yourself, and the team is available whenever you'd rather they handle it." },
  { q: "Do you offer a free website audit?", a: "Yes. Send your website address and DFE Technology will review speed, Google visibility, contact options and design, and tell you what to fix first." },
];
