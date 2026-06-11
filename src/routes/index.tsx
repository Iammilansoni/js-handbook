import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TOPICS, TOPIC_MAP } from "../handbook/data/topics";
import { useProgress } from "../handbook/hooks/useProgress";
import { Play, BookOpen } from "lucide-react";
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
  const { lastRead, completedTopics } = useProgress();
  
  const targetTopicId = lastRead?.topicId || TOPICS[0].slug;
  const isResuming = !!lastRead;
  const progressPercent = Math.round((completedTopics.size / TOPICS.length) * 100) || 0;
  const lastTopic = lastRead ? TOPIC_MAP[lastRead.topicId] : null;

  return (
    <div className="handbook hb-landing">
      <div className="hb-landing-card">
        <span className="hb-landing-eyebrow">v2.0 · FAANG track · 38 deep dives</span>
        <h1>The JavaScript handbook <em>you actually wanted</em>.</h1>
        <p>
          Mental models, real code, comparison tables, the mistakes everyone makes,
          and the interview questions you'll actually get — for every core concept.
        </p>
        
        {isResuming && lastTopic ? (
          <div className="hb-resume-card">
            <div className="hb-resume-info">
              <span className="hb-resume-label">Jump back in</span>
              <strong className="hb-resume-title">{lastTopic.title} {lastRead.sectionTitle ? `— ${lastRead.sectionTitle}` : ""}</strong>
              <div className="hb-resume-progress">
                <div className="hb-resume-bar">
                  <div className="hb-resume-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="hb-resume-pct">{completedTopics.size} / {TOPICS.length} completed</span>
              </div>
            </div>
            <Link 
              to="/handbook/$topicId" 
              params={{ topicId: targetTopicId }}
              hash={lastRead.sectionId}
              className="hb-cta"
            >
              <Play size={16} fill="currentColor" /> Continue
            </Link>
          </div>
        ) : (
          <Link 
            to="/handbook/$topicId" 
            params={{ topicId: targetTopicId }}
            className="hb-cta"
          >
            <BookOpen size={18} /> Start Reading →
          </Link>
        )}

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
