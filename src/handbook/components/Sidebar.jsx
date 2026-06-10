import { Link } from "@tanstack/react-router";
import { TOPICS } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import { CheckCircle2 } from "lucide-react";

export function Sidebar({ activeId }) {
  const { isCompleted } = useProgress();

  return (
    <aside className="hb-sidebar">
      <Link to="/" className="hb-brand" style={{ textDecoration: "none" }}>
        <div className="hb-brand-mark">JS</div>
        <div className="hb-brand-text">
          <span className="hb-brand-title">JS Handbook</span>
          <span className="hb-brand-sub">v2.0 · FAANG Track</span>
        </div>
      </Link>
      <div className="hb-nav-label">Topics</div>
      <ul className="hb-nav-list">
        {TOPICS.map((t) => {
          const active = t.slug === activeId;
          return (
            <li key={t.id}>
              <Link
                to="/handbook/$topicId"
                params={{ topicId: t.slug }}
                className={`hb-nav-item${active ? " is-active" : ""}`}
                style={{ "--hb-accent": `var(--hb-${t.color})` }}
              >
                <span className="hb-nav-icon">{t.icon}</span>
                <span className="hb-nav-item-text">
                  <span className="hb-nav-item-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {t.title}
                    {isCompleted(t.slug) && <CheckCircle2 size={14} color="var(--color-green)" />}
                  </span>
                  <span className="hb-nav-item-sub">{t.subtitle}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function MobileNav({ activeId }) {
  const { isCompleted } = useProgress();

  return (
    <nav className="hb-mobile-nav">
      {TOPICS.map((t) => {
        const active = t.slug === activeId;
        return (
          <Link
            key={t.id}
            to="/handbook/$topicId"
            params={{ topicId: t.slug }}
            className={`hb-chip${active ? " is-active" : ""}`}
            style={{ "--hb-accent": `var(--hb-${t.color})` }}
          >
            <span>{t.icon}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {t.title}
              {isCompleted(t.slug) && <CheckCircle2 size={12} color="var(--color-green)" />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
