import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

/** Public landing page */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <header className="border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{APP_NAME}</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          🙏 Spiritual Platform
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {APP_NAME}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">{APP_TAGLINE}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/admin">
            <Button size="lg">Open Admin Panel</Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            { title: "Temples", desc: "Comprehensive temple directory across India" },
            { title: "Pilgrimage", desc: "Routes, tips, and guides for devotees" },
            { title: "Multilingual", desc: "Gujarati, Hindi, and English content" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-card p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-2 font-semibold text-primary">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
