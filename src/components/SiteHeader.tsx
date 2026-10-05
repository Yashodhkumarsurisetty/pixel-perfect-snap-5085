import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  const link = "rounded-full px-4 py-2 font-semibold text-muted-foreground transition hover:bg-card hover:text-foreground";
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-display text-xl font-bold text-primary-foreground">Q</span>
        <span className="font-display text-2xl font-bold">Quizora</span>
      </Link>
      <nav className="flex items-center gap-1">
        <Link to="/quizzes" className={link} activeProps={{ className: "bg-card text-foreground" }}>Browse</Link>
        <Link to="/create" className="btn-pop ml-2 rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">Create</Link>
      </nav>
    </header>
  );
}
