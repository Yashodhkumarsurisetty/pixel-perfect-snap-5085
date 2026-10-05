import { Link } from "@tanstack/react-router";
import { categoryColor, type Quiz } from "@/lib/quizzes";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      to="/quiz/$id"
      params={{ id: quiz.id }}
      className="group flex flex-col rounded-3xl bg-card p-6 shadow-card transition hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-bold text-foreground ${categoryColor[quiz.category] ?? "bg-accent"}`}>
          {quiz.category}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{quiz.difficulty}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold">{quiz.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{quiz.description}</p>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{quiz.questions.length} questions</span>
        <span className="font-bold text-primary transition group-hover:translate-x-1">Play →</span>
      </div>
    </Link>
  );
}
