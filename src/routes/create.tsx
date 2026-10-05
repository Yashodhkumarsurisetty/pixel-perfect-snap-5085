import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { saveUserQuiz, type Question, type Quiz } from "@/lib/quizzes";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a quiz — Quizora" },
      { name: "description", content: "Write your own questions and build a quiz in minutes." },
      { property: "og:title", content: "Create a quiz — Quizora" },
      { property: "og:description", content: "Build your own quiz in minutes." },
    ],
  }),
  component: Create,
});

const blank = (): Question => ({ text: "", options: ["", "", "", ""], answer: 0 });
const field = "w-full rounded-xl border-2 bg-card px-4 py-3 outline-none focus:border-primary";

function Create() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Science");
  const [difficulty, setDifficulty] = useState<Quiz["difficulty"]>("Easy");
  const [timer, setTimer] = useState(30);
  const [qs, setQs] = useState<Question[]>([blank()]);
  const [error, setError] = useState("");

  const upd = (i: number, p: Partial<Question>) => setQs((a) => a.map((q, k) => (k === i ? { ...q, ...p } : q)));

  const publish = () => {
    if (!title.trim()) return setError("Give your quiz a title.");
    if (qs.some((q) => !q.text.trim() || q.options.some((o) => !o.trim()))) return setError("Fill in every question and all four answers.");
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now().toString(36);
    saveUserQuiz({ id, title, description, category, difficulty, timePerQuestion: timer, author: "You", questions: qs });
    nav({ to: "/quiz/$id", params: { id } });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20">
        <h1 className="text-4xl font-bold">Create a quiz</h1>
        <div className="mt-6 space-y-4 rounded-3xl bg-card p-6 shadow-card">
          <input className={field} placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className={field} placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-3">
            <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Science", "Geography", "Math", "Technology", "History", "General"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className={field} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Quiz["difficulty"])}>
              {["Easy", "Medium", "Hard"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className={field} value={timer} onChange={(e) => setTimer(Number(e.target.value))}>
              {[0, 15, 30, 60].map((t) => <option key={t} value={t}>{t ? `${t}s per question` : "No timer"}</option>)}
            </select>
          </div>
        </div>

        {qs.map((q, i) => (
          <div key={i} className="mt-5 rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Question {i + 1}</h2>
              {qs.length > 1 && <button onClick={() => setQs(qs.filter((_, k) => k !== i))} className="text-sm font-bold text-destructive">Remove</button>}
            </div>
            <input className={`${field} mt-3`} placeholder="Type your question" value={q.text} onChange={(e) => upd(i, { text: e.target.value })} />
            <p className="mt-4 text-sm text-muted-foreground">Tap the circle next to the correct answer.</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, j) => (
                <div key={j} className="flex items-center gap-2">
                  <button onClick={() => upd(i, { answer: j })} aria-label="Mark correct"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold ${q.answer === j ? "bg-success text-primary-foreground" : "bg-secondary"}`}>
                    {q.answer === j ? "✓" : "ABCD"[j]}
                  </button>
                  <input className={field} placeholder={`Answer ${"ABCD"[j]}`} value={o}
                    onChange={(e) => upd(i, { options: q.options.map((x, k) => (k === j ? e.target.value : x)) })} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => setQs([...qs, blank()])} className="mt-5 w-full rounded-3xl border-2 border-dashed border-primary py-4 font-bold text-primary">
          + Add question
        </button>
        {error && <p className="mt-4 font-semibold text-destructive">{error}</p>}
        <button onClick={publish} className="btn-pop mt-6 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground">Publish quiz</button>
      </main>
    </div>
  );
}
