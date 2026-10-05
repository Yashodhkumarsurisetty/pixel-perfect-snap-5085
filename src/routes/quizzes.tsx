import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { QuizCard } from "@/components/QuizCard";
import { loadUserQuizzes, sampleQuizzes, type Quiz } from "@/lib/quizzes";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Browse quizzes — Quizora" },
      { name: "description", content: "Find a quiz on science, geography, maths, tech and more." },
      { property: "og:title", content: "Browse quizzes — Quizora" },
      { property: "og:description", content: "Find a quiz and start playing." },
    ],
  }),
  component: Browse,
});

function Browse() {
  const [mine, setMine] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  useEffect(() => setMine(loadUserQuizzes()), []);
  const all = [...mine, ...sampleQuizzes];
  const cats = ["All", ...Array.from(new Set(all.map((q) => q.category)))];
  const list = useMemo(
    () => all.filter((q) => (cat === "All" || q.category === cat) && q.title.toLowerCase().includes(search.toLowerCase())),
    [all, cat, search],
  );
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <h1 className="text-4xl font-bold">Find your next quiz</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes…"
          className="mt-6 w-full rounded-2xl border-2 bg-card px-5 py-3.5 text-lg outline-none focus:border-primary"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((q) => <QuizCard key={q.id} quiz={q} />)}
        </div>
        {list.length === 0 && <p className="mt-10 text-center text-muted-foreground">No quizzes match. Try another search.</p>}
      </main>
    </div>
  );
}
