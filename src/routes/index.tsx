import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TOPICS } from "../handbook/data/topics";
import { useProgress } from "../handbook/hooks/useProgress";
import "../handbook/styles/handbook.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JS Handbook 2.0 — Master JavaScript from Beginner to FAANG" },
      { name: "description", content: "A premium, interactive handbook for mastering JavaScript: scope, closures, this, promises, the event loop, and prototypes — with FAANG-level interview prep." },
      { property: "og:title", content: "JS Handbook 2.0" },
      { property: "og:description", content: "Master JavaScript from beginner to FAANG interview level." },
    ],
  }),
  component: Index,
});

function Index() {
  const { lastRead } = useProgress();
  
  const targetTopicId = lastRead?.topicId || TOPICS[0].slug;
  const isResuming = !!lastRead;

  return (
    <div className="handbook hb-landing">
      <div className="hb-landing-card">
        <span className="hb-landing-eyebrow">v2.0 · FAANG track · 6 deep dives</span>
        <h1>The JavaScript handbook <em>you actually wanted</em>.</h1>
        <p>
          Mental models, real code, comparison tables, the mistakes everyone makes,
          and the interview questions you'll actually get — for every core concept.
        </p>
        <Link 
          to="/handbook/$topicId" 
          params={{ topicId: targetTopicId }}
          className="hb-cta"
        >
          Open the handbook →
        </Link>
        <div className="hb-landing-topics">
          {TOPICS.map((t) => (
            <Link
              key={t.id}
              to="/handbook/$topicId"
              params={{ topicId: t.slug }}
              className="hb-chip"
              style={{ ["--hb-accent" as string]: `var(--hb-${t.color})` }}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
