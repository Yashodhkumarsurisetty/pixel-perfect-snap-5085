import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-illustration.png";
import { SiteHeader } from "@/components/SiteHeader";
import { findQuiz, type Quiz } from "@/lib/quizzes";

export const Route = createFileRoute("/quiz/$id")({
  head: () => ({
    meta: [
      { title: "Play a quiz — Quizora" },
      { name: "description", content: "Answer each question and see how you score." },
      { property: "og:title", content: "Play a quiz — Quizora" },
      { property: "og:description", content: "Answer each question and see how you score." },
    ],
  }),
  component: QuizPage,
});

const letters = ["A", "B", "C", "D", "E", "F"];

function QuizPage() {
  const { id } = Route.useParams();
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);
  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => setQuiz(findQuiz(id) ?? null), [id]);

  const q = quiz?.questions[idx];
  const picked = answers[idx] ?? null;
  const locked = picked !== null || (quiz?.timePerQuestion ? time <= 0 : false);

  useEffect(() => {
    if (stage !== "play" || !quiz?.timePerQuestion || locked) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [stage, quiz, locked, idx]);

  if (quiz === undefined) return <div className="min-h-screen" />;
  if (quiz === null)
    return (
      <div className="min-h-screen"><SiteHeader />
        <div className="mx-auto max-w-md rounded-3xl bg-card p-10 text-center shadow-card">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <Link to="/quizzes" className="mt-4 inline-block font-bold text-primary">Browse quizzes →</Link>
        </div>
      </div>
    );

  const start = () => { setAnswers(Array(quiz.questions.length).fill(null)); setIdx(0); setTime(quiz.timePerQuestion); setStage("play"); };
  const pick = (i: number) => { if (locked) return; setAnswers((a) => a.map((v, k) => (k === idx ? i : v))); };
  const next = () => {
    if (idx + 1 >= quiz.questions.length) return setStage("done");
    setIdx(idx + 1); setTime(quiz.timePerQuestion);
  };
  const score = answers.filter((a, i) => a === quiz.questions[i]?.answer).length;
  const pct = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="relative mx-auto max-w-5xl px-4 pb-16">
        <img src={hero} alt="" aria-hidden width={1024} height={1024} className="float-slow pointer-events-none absolute -right-24 -top-10 hidden w-56 opacity-90 lg:block" />
        <div className="relative rounded-[2rem] bg-card p-6 shadow-card md:p-12">
          {stage === "intro" && (
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">{quiz.category} · {quiz.difficulty}</span>
                <h1 className="mt-2 text-4xl font-bold md:text-5xl">{quiz.title}</h1>
                <p className="mt-3 text-lg text-muted-foreground">{quiz.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="rounded-full bg-secondary px-4 py-2">{quiz.questions.length} questions</span>
                  <span className="rounded-full bg-secondary px-4 py-2">{quiz.timePerQuestion ? `${quiz.timePerQuestion}s per question` : "No timer"}</span>
                  <span className="rounded-full bg-secondary px-4 py-2">By {quiz.author}</span>
                </div>
                <button onClick={start} className="btn-pop mt-8 rounded-2xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground">Start quiz</button>
              </div>
              <img src={hero} alt="" width={1024} height={1024} className="mx-auto w-52 md:w-64" />
            </div>
          )}

          {stage === "play" && q && (
            <div key={idx} className="animate-slide">
              <div className="flex items-center gap-4">
                <div className="flex flex-1 gap-1.5">
                  {quiz.questions.map((_, i) => (
                    <div key={i} className={`h-2.5 flex-1 rounded-full transition-colors ${i < idx ? "bg-primary" : i === idx ? "bg-sun" : "bg-muted"}`} />
                  ))}
                </div>
                {quiz.timePerQuestion > 0 && (
                  <span className={`min-w-16 rounded-full px-3 py-1 text-center font-display font-semibold ${time <= 5 ? "bg-danger-soft text-destructive" : "bg-secondary"}`}>
                    ⏱ {Math.max(time, 0)}s
                  </span>
                )}
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Question {idx + 1} of {quiz.questions.length}
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-4xl">{q.text}</h2>
              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {q.options.map((opt, i) => {
                  const isPick = picked === i;
                  const isRight = locked && i === q.answer;
                  const isWrong = locked && isPick && i !== q.answer;
                  return (
                    <button key={i} onClick={() => pick(i)} disabled={locked}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left text-lg font-semibold transition md:p-5
                        ${isRight ? "border-success bg-success-soft" : isWrong ? "border-destructive bg-danger-soft" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary"}
                        ${isPick ? "scale-[1.02]" : ""}`}>
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display font-bold
                        ${isRight ? "animate-pop bg-success text-primary-foreground" : isWrong ? "animate-pop bg-destructive text-primary-foreground" : "bg-secondary"}`}>
                        {isRight ? "✓" : isWrong ? "✕" : letters[i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {locked && (
                <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <p className="text-muted-foreground">
                    {picked === null ? "Time's up! " : picked === q.answer ? "Nice one! " : "Not quite. "}
                    {q.explanation}
                  </p>
                  <button onClick={next} className="btn-pop shrink-0 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground">
                    {idx + 1 >= quiz.questions.length ? "See results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === "done" && (
            <div className="animate-pop">
              <div className="text-center">
                <div className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-secondary"
                  style={{ background: `conic-gradient(var(--primary) ${pct}%, var(--muted) 0)` }}>
                  <div className="grid h-32 w-32 place-items-center rounded-full bg-card">
                    <span className="font-display text-4xl font-bold">{pct}%</span>
                  </div>
                </div>
                <h1 className="mt-6 text-4xl font-bold">{pct >= 80 ? "Brilliant!" : pct >= 50 ? "Good job!" : "Keep practising!"}</h1>
                <p className="mt-2 text-lg text-muted-foreground">You got {score} of {quiz.questions.length} right.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={start} className="btn-pop rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground">Play again</button>
                  <Link to="/quizzes" className="rounded-2xl bg-secondary px-8 py-3 font-bold">More quizzes</Link>
                </div>
              </div>
              <h2 className="mt-12 text-2xl font-semibold">Answer review</h2>
              <ol className="mt-4 space-y-3">
                {quiz.questions.map((qq, i) => {
                  const ok = answers[i] === qq.answer;
                  return (
                    <li key={i} className={`rounded-2xl p-4 ${ok ? "bg-success-soft" : "bg-danger-soft"}`}>
                      <p className="font-semibold">{i + 1}. {qq.text}</p>
                      <p className="mt-1 text-sm">
                        Your answer: <b>{answers[i] === null ? "No answer" : qq.options[answers[i]!]}</b>
                        {!ok && <> · Correct: <b>{qq.options[qq.answer]}</b></>}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
