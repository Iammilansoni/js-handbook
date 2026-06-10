export interface Topic {
  id: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  overview: { definition: string; why_it_exists: string; framework_usage: string; interview_relevance: string };
  mentalModel: { analogy: string; ascii_visual_diagram: string; common_misconceptions: string[] };
  theory: Array<{ title: string; description: string; code: string }>;
  comparison?: { headers: string[]; rows: string[][] };
  mistakes: Array<{ wrong: string; right: string; why: string }>;
  interview: Array<{ q: string; a: string; level: "Beginner" | "Intermediate" | "Advanced" | "FAANG" }>;
  cheatsheet: string[];
}
export const TOPICS: Topic[];
export const TOPIC_MAP: Record<string, Topic>;
