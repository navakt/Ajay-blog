import React, { useMemo, useRef, useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Search, Mail, Phone, MapPin, Shield, BookOpen, Users2, Sun, Moon, ArrowUpRight, ChevronDown, Github, Linkedin, Rss } from "lucide-react";



// Single‑file, production‑ready React component using TailwindCSS

// — Dynamic sections, blog search/filter, dark mode, smooth scrolling,

// — Framer Motion animations, accessible nav, responsive grid layout

// — No backend required; form uses mailto & localStorage as a fallback



// ---- Utilities ----

const nav = [

{ id: "home", label: "Home" },

{ id: "features", label: "Features" },

{ id: "aim", label: "Aim" },

{ id: "blog", label: "Blog" },

{ id: "resources", label: "Resources" },

{ id: "community", label: "Community" },

{ id: "contact", label: "Contact" },

];



const capsule = "rounded-2xl px-4 py-1 text-xs font-semibold border inline-flex items-center gap-2";

const sectionPad = "py-16 sm:py-20";

const h2 = "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight";

const sub = "text-sm sm:text-base text-muted-foreground max-w-3xl";



const defaultCopy = {

heroTitle: "Empower Your Cybersecurity Journey",

heroKicker: "ajaysblog",

heroLead:

"A clean, fast, and helpful place to learn cybersecurity — from beginner roadmaps to hands‑on tips. We also offer free mentoring to help you pick the right path.",

aimTitle: "My Aim",

aimLead:

"To make cybersecurity learnable for everyone by sharing practical articles, beginner guidance, and curated resources — without paywalls.",

};



const features = [

{

icon: <Shield className="h-6 w-6" aria-hidden />,

title: "Expert Insights",

desc: "Concise explainers and up‑to‑date guidance so you can protect your data with confidence.",

stat: "100%",

foot: "Mentoring Support",

},

{

icon: <BookOpen className="h-6 w-6" aria-hidden />,

title: "Guides for Beginners",

desc: "Clear roadmaps and study plans to start a career in cybersecurity the sane way.",

stat: "Free",

foot: "Always",

},

{

icon: <Users2 className="h-6 w-6" aria-hidden />,

title: "Interactive Community",

desc: "Discuss, ask, and learn together — because security is a team sport.",

stat: "Open",

foot: "To All",

},

];



const blogData = [

{

id: 1,

title: "Getting Started in Cybersecurity: A Simple Roadmap",

tags: ["beginner", "career"],

excerpt:

"Understand core areas (networking, Linux, web), build labs, and learn by doing. This post outlines a 12‑week starter plan.",

date: "2025-07-10",

},

{

id: 2,

title: "Top 10 Free Resources for Learning Security in 2025",

tags: ["resources", "free"],

excerpt:

"From labs to newsletters — a curated list you can follow without getting overwhelmed.",

date: "2025-07-24",

},

{

id: 3,

title: "How to Think Like an Attacker (Legally)",

tags: ["mindset", "pentest"],

excerpt:

"Threat modeling, checklists, and safe practice environments to grow your red‑team skills.",

date: "2025-08-05",

},

];



function useDarkMode() {

const [dark, setDark] = useState(false);

useEffect(() => {

const saved = localStorage.getItem("ajaysblog:dark");

if (saved) setDark(saved === "true");

}, []);

useEffect(() => {

document.documentElement.classList.toggle("dark", dark);

localStorage.setItem("ajaysblog:dark", String(dark));

}, [dark]);

return [dark, setDark] as const;

}



function Badge({ children }: { children: React.ReactNode }) {

return (

<span className="rounded-full border px-3 py-1 text-xs font-medium bg-white/60 dark:bg-white/5 backdrop-blur">

{children}

</span>

);

}



function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {

return (

<div className={"rounded-2xl border shadow-sm bg-white dark:bg-neutral-900 " + className}>{children}</div>

);

}



function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {

return (

<section id={id} className={`${sectionPad} ${className}`}>

<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>

</section>

);

}



function useScrollSpy(ids: string[], offset = 80) {

const [active, setActive] = useState(ids[0]);

useEffect(() => {

const handler = () => {

const pos = window.scrollY + offset + 1;

for (let i = ids.length - 1; i >= 0; i--) {

const el = document.getElementById(ids[i]);

if (el && el.offsetTop <= pos) {

setActive(ids[i]);

break;

}

}

};

handler();

window.addEventListener("scroll", handler, { passive: true });

return () => window.removeEventListener("scroll", handler);

}, [ids, offset]);

return active;

}



function Newsletter() {

const [email, setEmail] = useState("");

const [done, setDone] = useState(false);

return (

<Card className="p-6 md:p-8">

<div className="flex flex-col md:flex-row md:items-center gap-4">

<div className="flex-1">

<h3 className="text-lg font-bold">Subscribe to the newsletter</h3>

<p className="text-sm text-muted-foreground">Occasional updates. No spam. Unsubscribe anytime.</p>

</div>

<form

onSubmit={(e) => {

e.preventDefault();

const list = JSON.parse(localStorage.getItem("ajaysblog:subs") || "[]");

list.push({ email, at: Date.now() });

localStorage.setItem("ajaysblog:subs", JSON.stringify(list));

setDone(true);

}}

className="flex w-full md:w-auto gap-2"

>

<input

required

value={email}

onChange={(e) => setEmail(e.target.value)}

type="email"

placeholder="you@example.com"

className="flex-1 md:w-72 rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950"

aria-label="Email address"

/>

<button className="rounded-xl px-4 py-2 font-semibold border bg-black text-white dark:bg-white dark:text-black">

{done ? "Added" : "Join"}

</button>

</form>

</div>

</Card>

);

}



function BlogList() {

const [q, setQ] = useState("");

const [tag, setTag] = useState<string | null>(null);

const tags = useMemo(() => {

const s = new Set<string>();

blogData.forEach((p) => p.tags.forEach((t) => s.add(t)));

return Array.from(s);

}, []);

const results = blogData

.filter((p) => (tag ? p.tags.includes(tag) : true))

.filter((p) => (q ? p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()) : true))

.sort((a, b) => b.date.localeCompare(a.date));



return (

<div className="space-y-6">

<div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">

<div className="relative w-full sm:w-96">

<Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />

<input

value={q}

onChange={(e) => setQ(e.target.value)}

placeholder="Search posts…"

className="w-full rounded-xl border pl-10 pr-3 py-2 bg-white dark:bg-neutral-950"

aria-label="Search blog posts"

/>

</div>

<div className="flex gap-2 overflow-x-auto">

<button onClick={() => setTag(null)} className={`${capsule} ${tag === null ? "bg-black text-white dark:bg-white dark:text-black" : "bg-transparent"}`}>All</button>

{tags.map((t) => (

<button key={t} onClick={() => setTag(t)} className={`${capsule} ${tag === t ? "bg-black text-white dark:bg-white dark:text-black" : "bg-transparent"}`}>

#{t}

</button>

))}

</div>

</div>

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

{results.map((p) => (

<motion.article key={p.id} layout initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border p-6 bg-white dark:bg-neutral-900">

<div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</div>

<h3 className="mt-2 text-lg font-bold">{p.title}</h3>

<p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>

<div className="mt-3 flex flex-wrap gap-2">

{p.tags.map((t) => (

<Badge key={t}>#{t}</Badge>

))}

</div>

<button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">

Read more <ArrowUpRight className="h-4 w-4" />

</button>

</motion.article>

))}

</div>

</div>

);

}



function ContactCard() {

const [name, setName] = useState("");

const [email, setEmail] = useState("");

const [msg, setMsg] = useState("");

const [sent, setSent] = useState(false);



const mailto = `mailto:ajayjayaraman123@gmail.com?subject=Hello%20Ajay%20from%20ajaysblog&body=${encodeURIComponent(

`Name: ${name}\nEmail: ${email}\n\n${msg}`

)}`;



return (

<Card className="p-6 md:p-8">

<div className="grid md:grid-cols-2 gap-6">

<div className="space-y-2">

<h3 className="text-xl font-bold">Let’s talk</h3>

<p className="text-sm text-muted-foreground">Have a question, need mentoring, or want to collaborate? Send a note.</p>

<div className="mt-4 space-y-2 text-sm">

<div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+918590480469" className="underline decoration-dotted">+91 85904 80469</a></div>

<div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:ajayjayaraman123@gmail.com" className="underline decoration-dotted">ajayjayaraman123@gmail.com</a></div>

<div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Calicut, India</div>

</div>

</div>

<form

onSubmit={(e) => {

e.preventDefault();

const list = JSON.parse(localStorage.getItem("ajaysblog:messages") || "[]");

list.push({ name, email, msg, at: Date.now() });

localStorage.setItem("ajaysblog:messages", JSON.stringify(list));

setSent(true);

}}

className="space-y-3"

>

<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950" />

<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950" />

<textarea required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="How can I help?" rows={5} className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950" />

<div className="flex gap-2">

<a href={mailto} className="rounded-xl px-4 py-2 font-semibold border bg-black text-white dark:bg-white dark:text-black">Send email</a>

<button type="submit" className="rounded-xl px-4 py-2 font-semibold border">Save locally</button>

{sent && <span className="text-sm text-green-600 dark:text-green-400">Saved. Please use "Send email" to reach me.</span>}

</div>

</form>

</div>

</Card>

);

}



function Footer() {

return (

<footer className="py-10 border-t">

<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4 text-sm">

<div>

<div className="font-bold">Ajay E</div>

<div className="text-muted-foreground">© {new Date().getFullYear()} ajaysblog. All rights reserved.</div>

</div>

<div className="flex items-center gap-4">

<a aria-label="RSS" href="#" className="underline decoration-dotted flex items-center gap-2"><Rss className="h-4 w-4" /> RSS</a>

<a aria-label="GitHub" href="#" className="underline decoration-dotted flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a>

<a aria-label="LinkedIn" href="#" className="underline decoration-dotted flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</a>

</div>

</div>

</footer>

);

}



export default function AjaysBlogSite() {

const [dark, setDark] = useDarkMode();

const active = useScrollSpy(nav.map((n) => n.id));

const topRef = useRef<HTMLDivElement | null>(null);



return (

<div ref={topRef} className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">

{/* Skip link */}

<a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-black text-white dark:bg-white dark:text-black rounded px-3 py-2">Skip to content</a>



{/* Header */}

<header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/70 border-b">

<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

<a href="#home" className="font-extrabold tracking-tight text-lg">ajaysblog</a>

<nav className="hidden md:flex items-center gap-2">

{nav.map((n) => (

<a key={n.id} href={`#${n.id}`} className={`px-3 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 ${active === n.id ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>{n.label}</a>

))}

</nav>

<div className="flex items-center gap-2">

<button aria-label="Toggle dark mode" onClick={() => setDark(!dark)} className="rounded-xl border p-2">

{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}

</button>

<a href="#contact" className="hidden sm:inline-flex rounded-xl px-3 py-2 font-semibold border">Contact</a>

</div>

</div>

</header>



<main id="content">

{/* Hero */}

<Section id="home" className="pt-10 sm:pt-14">

<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

<div>

<div className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-semibold bg-white/70 dark:bg-white/5 backdrop-blur">

<span className="i">Welcome</span>

<span className="opacity-60">—</span>

<span>Free Mentoring</span>

</div>

<h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">

{defaultCopy.heroTitle} <span className="opacity-70">with</span> <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{defaultCopy.heroKicker}</span>

</h1>

<p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl">{defaultCopy.heroLead}</p>

<div className="mt-6 flex flex-wrap gap-3">

<a href="#blog" className="rounded-xl px-4 py-2 font-semibold border bg-black text-white dark:bg-white dark:text-black">Explore Now</a>

<a href="#contact" className="rounded-xl px-4 py-2 font-semibold border">Get Mentoring</a>

</div>

</div>

<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="aspect-[5/3] rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/20 flex items-center justify-center">

<Shield className="h-20 w-20" />

</motion.div>

</div>



<div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

{features.map((f, i) => (

<Card key={i} className="p-6">

<div className="flex items-center justify-between">

<div className="rounded-xl border p-2">{f.icon}</div>

<div className="text-right">

<div className="text-xs text-muted-foreground">{f.foot}</div>

<div className="text-xl font-extrabold">{f.stat}</div>

</div>

</div>

<h3 className="mt-4 font-bold">{f.title}</h3>

<p className="text-sm text-muted-foreground">{f.desc}</p>

</Card>

))}

</div>

</Section>



{/* Features / Advantages */}

<Section id="features" className="bg-white/60 dark:bg-neutral-950/40">

<div className="flex flex-col gap-3">

<h2 className={h2}>Advantages of Ajay's blog</h2>

<p className={sub}>Practical security content, free mentoring, and a supportive community —

everything you need to get started and keep growing.</p>

</div>

<div className="mt-8 grid md:grid-cols-3 gap-6">

{features.map((f, i) => (

<motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

<Card className="p-6 h-full">

<h3 className="font-bold flex items-center gap-2">{f.icon}{f.title}</h3>

<p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>

</Card>

</motion.div>

))}

</div>

</Section>



{/* Aim */}

<Section id="aim">

<div className="flex flex-col gap-3">

<h2 className={h2}>{defaultCopy.aimTitle}</h2>

<p className={sub}>{defaultCopy.aimLead}</p>

</div>

<div className="mt-8 grid lg:grid-cols-2 gap-6">

<Card className="p-6">

<h3 className="font-bold">Blogs & Articles</h3>

<p className="text-sm text-muted-foreground mt-1">Actionable posts on topics like secure networking, OWASP, Linux basics, threat modeling, and more.</p>

</Card>

<Card className="p-6">

<h3 className="font-bold">Guidance for Beginners</h3>

<p className="text-sm text-muted-foreground mt-1">Clear fundamentals, a learning sequence, and career tips to choose a path that fits you best.</p>

</Card>

<Card className="p-6">

<h3 className="font-bold">Mentoring Support</h3>

<p className="text-sm text-muted-foreground mt-1">1:1 help for study plans, portfolio advice, and interview preparation — totally free.</p>

</Card>

<Card className="p-6">

<h3 className="font-bold">Resource Library</h3>

<p className="text-sm text-muted-foreground mt-1">A curated list of tools, labs, and references you can reuse, updated over time.</p>

</Card>

</div>

</Section>



{/* Blog */}

<Section id="blog" className="bg-white/60 dark:bg-neutral-950/40">

<div className="flex flex-col gap-3">

<h2 className={h2}>Latest Posts</h2>

<p className={sub}>Search or filter by tag. Hook this up to a CMS later (e.g., Markdown, Notion, or a headless CMS).

</p>

</div>

<div className="mt-8">

<BlogList />

</div>

</Section>



{/* Resources / Community */}

<Section id="resources">

<div className="grid lg:grid-cols-2 gap-6 items-start">

<div>

<h2 className={h2}>Key Resources</h2>

<p className={sub}>Handpicked content to build a solid base and keep skills sharp.</p>

<div className="mt-6 grid sm:grid-cols-2 gap-4">

<Card className="p-5"><h3 className="font-semibold">Career Development</h3><p className="text-sm text-muted-foreground">Resume tips, roadmaps, and success stories to stay motivated.</p></Card>

<Card className="p-5"><h3 className="font-semibold">Expert Contributors</h3><p className="text-sm text-muted-foreground">Perspectives from practitioners and community members.</p></Card>

<Card className="p-5"><h3 className="font-semibold">Practice Labs</h3><p className="text-sm text-muted-foreground">Safe environments for hands‑on learning (CTFs, Docker labs).</p></Card>

<Card className="p-5"><h3 className="font-semibold">Reading Lists</h3><p className="text-sm text-muted-foreground">Curated papers, books, and newsletters that actually help.</p></Card>

</div>

</div>

<div>

<h2 className={h2}>Join the Community</h2>

<p className={sub}>Ask questions, share wins, and learn together.</p>

<div className="mt-6">

<Newsletter />

</div>

</div>

</div>

</Section>



{/* Community */}

<Section id="community" className="bg-white/60 dark:bg-neutral-950/40">

<div className="flex flex-col gap-3">

<h2 className={h2}>What learners say</h2>

<p className={sub}>Real feedback from the community.</p>

</div>

<div className="mt-8 grid lg:grid-cols-3 gap-6">

{[

{

name: "Navaneeth Kumar T",

role: "IT Professional",

quote:

"ajaysblog's guidance and free mentoring helped me navigate cybersecurity topics and advance my career.",

},

{

name: "Aisha P",

role: "Student",

quote:

"The beginner roadmap is clear and practical. I finally know what to learn first!",

},

{

name: "Rahul S",

role: "Security Enthusiast",

quote:

"Short posts with checklists — perfect for consistent progress.",

},

].map((t, i) => (

<Card key={i} className="p-6">

<p className="text-sm">“{t.quote}”</p>

<div className="mt-4 text-sm text-muted-foreground">{t.name}, {t.role}</div>

</Card>

))}

</div>

</Section>



{/* Contact */}

<Section id="contact">

<div className="flex flex-col gap-3">

<h2 className={h2}>Contact</h2>

<p className={sub}>Prefer email or phone? Use the details below, or send a message.</p>

</div>

<div className="mt-8">

<ContactCard />

</div>

</Section>

</main>



<Footer />



{/* Back to top */}

<button

onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}

aria-label="Back to top"

className="fixed bottom-4 right-4 rounded-full border p-3 shadow bg-white dark:bg-neutral-900"

>

<ChevronDown className="h-5 w-5 rotate-180" />

</button>

</div>

);

}



// Tailwind notes:

// - Ensure your app has Tailwind configured. If using Vite/CRA/Next, include the default Tailwind setup.

// - This component uses the system 'dark' class on <html>. Add 'dark' to tailwind.config.js.

// - All content is editable; replace placeholders, add real blog posts, and wire RSS/CMS when ready.
