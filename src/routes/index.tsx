import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-illustration.png";
import { SiteHeader } from "@/components/SiteHeader";
import { QuizCard } from "@/components/QuizCard";
import { sampleQuizzes } from "@/lib/quizzes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quizora — Create. Play. Learn." },
      { name: "description", content: "Make your own quizzes and play quizzes made by others on Quizora." },
      { property: "og:title", content: "Quizora — Create. Play. Learn." },
      { property: "og:description", content: "Make your own quizzes and play quizzes made by others." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="rounded-full bg-card px-4 py-1.5 text-sm font-bold text-primary">Create. Play. Learn.</span>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
            Quizzes that make learning feel like <span className="text-primary">play</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Build a quiz in minutes, share it, and test what you know with quizzes from everyone else.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quizzes" className="btn-pop rounded-2xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground">Start playing</Link>
            <Link to="/create" className="rounded-2xl bg-card px-7 py-3.5 text-lg font-bold shadow-card">Make a quiz</Link>
          </div>
        </div>
        <img src={hero} alt="Books, globe, lightbulb and rocket" width={1024} height={1024} className="float-slow mx-auto w-full max-w-md" />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Popular quizzes</h2>
          <Link to="/quizzes" className="font-bold text-primary">See all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sampleQuizzes.map((q) => <QuizCard key={q.id} quiz={q} />)}
        </div>
      </section>
    </div>
  );
}
