import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { Code } from "./Code";
import { Cmp } from "./Cmp";
import { AsciiDiagram } from "./AsciiDiagram";
import { Mistake } from "./Mistake";
import { InterviewQA } from "./InterviewQA";
import { Cheatsheet } from "./Cheatsheet";
import { CodeChallenge } from "./CodeChallenge";
import { useProgress } from "../hooks/useProgress";
import { CheckCircle2, Circle } from "lucide-react";

export function TopicView({ topic }) {
  const { isCompleted, toggleProgress, setLastRead, lastRead } = useProgress();
  const completed = isCompleted(topic.id.toString());
  const accent = `var(--hb-${topic.color})`;
  const containerRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptSectionId, setPromptSectionId] = useState(null);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setPromptSectionId(hash);
      setShowPrompt(true);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (lastRead && lastRead.topicId === topic.slug) {
      setPromptSectionId(lastRead.sectionId);
      setShowPrompt(true);
    } else {
      setIsObserving(true);
    }
  }, [topic.id]);

  useEffect(() => {
    if (!isObserving || !containerRef.current || !setLastRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionTitle = entry.target.getAttribute("data-title");
            setLastRead(topic.slug, entry.target.id, sectionTitle);
          }
        });
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    const sections = containerRef.current.querySelectorAll("section.hb-section");
    sections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, [topic.id, setLastRead, isObserving]);

  return (
    <div className="hb-container" style={{ "--hb-accent": accent }} key={topic.id} ref={containerRef}>
      <header className="hb-topic-header">
        <div className="hb-topic-icon">{topic.icon}</div>
        <div className="hb-topic-header-text">
          <h1 className="hb-topic-title">{topic.title}</h1>
          <p className="hb-topic-subtitle">{topic.subtitle}</p>
        </div>
      </header>

      <Section eyebrow="Overview" title="What & Why">
        <div className="hb-grid-2">
          <div className="hb-stat">
            <div className="hb-stat-label">Definition</div>
            <div className="hb-stat-value">{topic.overview.definition}</div>
          </div>
          <div className="hb-stat">
            <div className="hb-stat-label">Why it exists</div>
            <div className="hb-stat-value">{topic.overview.why_it_exists || topic.overview.why}</div>
          </div>
          <div className="hb-stat">
            <div className="hb-stat-label">Framework usage</div>
            <div className="hb-stat-value">{topic.overview.framework_usage || [topic.overview.react, topic.overview.node, topic.overview.express].filter(Boolean).join(" ")}</div>
          </div>
          <div className="hb-stat">
            <div className="hb-stat-label">Interview relevance</div>
            <div className="hb-stat-value">{topic.overview.interview_relevance || topic.overview.interview}</div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Mental Model" title="How to picture it">
        <p><strong style={{ color: "var(--hb-fg)" }}>Analogy.</strong> {topic.mentalModel.analogy}</p>
        <AsciiDiagram>{topic.mentalModel.ascii_visual_diagram || topic.mentalModel.visual}</AsciiDiagram>
        <ul className="hb-misc">
          {(topic.mentalModel.common_misconceptions || topic.mentalModel.misconceptions || []).map((m, i) => (
            <li key={i}>{Array.isArray(m) ? <><strong style={{color:"var(--hb-fg)"}}>{m[0]}</strong>: {m[1]}</> : m}</li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Theory" title="Core mechanics">
        {topic.theory.map((t, i) => (
          <div key={i} style={{ marginBottom: i === topic.theory.length - 1 ? 0 : 22 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "var(--hb-fg)" }}>{t.title}</h3>
            <p>{t.description || t.desc}</p>
            <Code>{t.code}</Code>
          </div>
        ))}
      </Section>

      {topic.comparison && (
        <Section eyebrow="Comparison" title="Side by side">
          <Cmp headers={topic.comparison.headers} rows={topic.comparison.rows} />
        </Section>
      )}

      <Section eyebrow="Common Mistakes" title="Wrong vs Right">
        {topic.mistakes.map((m, i) => <Mistake key={i} {...m} />)}
      </Section>

      <Section eyebrow="Interview" title="Questions you'll actually get">
        {topic.interview.map((q, i) => <InterviewQA key={i} {...q} />)}
      </Section>

      {topic.challenge && (
        <CodeChallenge challenge={topic.challenge} accent={accent} />
      )}

      <Section eyebrow="Cheatsheet" title="Rapid-fire recall">
        <Cheatsheet items={topic.cheatsheet} />
      </Section>

      <div style={{ marginTop: 40, padding: 24, borderRadius: "var(--hb-radius-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid var(--hb-border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", color: "var(--hb-fg)", fontSize: 16 }}>Topic Progress</h3>
          <p style={{ margin: 0, color: "var(--hb-fg-muted)", fontSize: 14 }}>Mark this topic as completed to track your progress in the sidebar.</p>
        </div>
        <button 
          onClick={() => toggleProgress(topic.slug)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: "8px", cursor: "pointer",
            border: completed ? "1px solid var(--hb-green)" : "1px solid var(--hb-border)",
            background: completed ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
            color: completed ? "var(--hb-green)" : "var(--hb-fg)",
            fontWeight: 600, fontSize: 14, transition: "all 0.2s"
          }}
        >
          {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed ? "Completed" : "Mark as complete"}
        </button>
      </div>

      {showPrompt && promptSectionId && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 100,
          background: "var(--hb-bg-glass)", border: "1px solid var(--hb-border)",
          padding: "16px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", gap: 16, backdropFilter: "blur(12px)"
        }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--hb-fg)", fontWeight: 500 }}>
            Resume from <strong style={{ color: "var(--hb-accent)" }}>{lastRead?.sectionTitle || promptSectionId}</strong>?
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              onClick={() => {
                setShowPrompt(false);
                setTimeout(() => {
                  document.getElementById(promptSectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => setIsObserving(true), 800);
                }, 50);
              }}
              style={{
                background: "var(--hb-accent)", color: "#000", border: "none",
                padding: "6px 12px", borderRadius: "6px", fontWeight: 600, fontSize: 13, cursor: "pointer"
              }}
            >
              Continue
            </button>
            <button 
              onClick={() => {
                setShowPrompt(false);
                setIsObserving(true);
              }}
              style={{
                background: "rgba(255,255,255,0.1)", color: "var(--hb-fg)", border: "none",
                padding: "6px 12px", borderRadius: "6px", fontSize: 13, cursor: "pointer"
              }}
            >
              Start New
            </button>
          </div>
        </div>
      )}

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": `${topic.title} - JS Handbook`,
            "description": topic.overview.definition || topic.subtitle,
            "author": {
              "@type": "Organization",
              "name": "JS Handbook"
            },
            "publisher": {
              "@type": "Organization",
              "name": "JS Handbook"
            },
            "educationalLevel": "advanced",
            "about": [
              {
                "@type": "Thing",
                "name": "JavaScript"
              }
            ]
          })
        }}
      />
    </div>
  );
}
