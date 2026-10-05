export type Question = { text: string; options: string[]; answer: number; explanation?: string };
export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timePerQuestion: number; // seconds, 0 = no timer
  author: string;
  questions: Question[];
};

export const sampleQuizzes: Quiz[] = [
  {
    id: "space-basics",
    title: "Journey Through Space",
    description: "Planets, stars and the rockets that reach them.",
    category: "Science",
    difficulty: "Easy",
    timePerQuestion: 30,
    author: "Quizora Team",
    questions: [
      { text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1, explanation: "Iron oxide dust gives Mars its reddish colour." },
      { text: "What is the largest planet in our solar system?", options: ["Saturn", "Neptune", "Jupiter", "Earth"], answer: 2 },
      { text: "What is at the centre of our solar system?", options: ["The Moon", "Earth", "A black hole", "The Sun"], answer: 3 },
      { text: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], answer: 1, explanation: "Pluto was reclassified as a dwarf planet in 2006." },
      { text: "Who was the first person to walk on the Moon?", options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Sally Ride"], answer: 0 },
    ],
  },
  {
    id: "world-geography",
    title: "Around the World",
    description: "Capitals, rivers and landmarks across the globe.",
    category: "Geography",
    difficulty: "Medium",
    timePerQuestion: 25,
    author: "Quizora Team",
    questions: [
      { text: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
      { text: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1 },
      { text: "Mount Everest lies on the border of Nepal and…", options: ["India", "Bhutan", "China", "Pakistan"], answer: 2 },
      { text: "Which country has the most people?", options: ["India", "China", "USA", "Indonesia"], answer: 0, explanation: "India overtook China in 2023." },
    ],
  },
  {
    id: "math-warmup",
    title: "Math Warm-Up",
    description: "Quick mental maths to get your brain going.",
    category: "Math",
    difficulty: "Easy",
    timePerQuestion: 20,
    author: "Quizora Team",
    questions: [
      { text: "What is 7 × 8?", options: ["54", "56", "64", "48"], answer: 1 },
      { text: "What is 15% of 200?", options: ["15", "20", "30", "35"], answer: 2 },
      { text: "What is the square root of 144?", options: ["11", "12", "13", "14"], answer: 1 },
      { text: "Which number is prime?", options: ["21", "27", "29", "33"], answer: 2 },
    ],
  },
  {
    id: "web-dev",
    title: "Web Dev Essentials",
    description: "HTML, CSS and JavaScript fundamentals.",
    category: "Technology",
    difficulty: "Hard",
    timePerQuestion: 0,
    author: "Quizora Team",
    questions: [
      { text: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 1 },
      { text: "Which HTML tag creates a link?", options: ["<link>", "<href>", "<a>", "<url>"], answer: 2 },
      { text: "Which keyword declares a constant in JavaScript?", options: ["let", "var", "const", "static"], answer: 2 },
      { text: "What does `typeof null` return?", options: ["'null'", "'object'", "'undefined'", "'number'"], answer: 1, explanation: "A famous quirk from JavaScript's first version." },
    ],
  },
];

const KEY = "quizora:quizzes";

export function loadUserQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveUserQuiz(q: Quiz) {
  const all = loadUserQuizzes().filter((x) => x.id !== q.id);
  localStorage.setItem(KEY, JSON.stringify([q, ...all]));
}

export function findQuiz(id: string): Quiz | undefined {
  return sampleQuizzes.find((q) => q.id === id) ?? loadUserQuizzes().find((q) => q.id === id);
}

export const categoryColor: Record<string, string> = {
  Science: "bg-sky",
  Geography: "bg-mint",
  Math: "bg-sun",
  Technology: "bg-coral",
};
