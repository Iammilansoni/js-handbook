import { Badge } from "./Badge";
export function InterviewQA({ q, a, level }) {
  return (
    <details className="hb-qa">
      <summary className="hb-qa-summary">
        {level && <Badge level={level} />}
        <span className="hb-qa-summary-text">{q}</span>
        <span className="hb-qa-summary-icon">+</span>
      </summary>
      <div className="hb-qa-body">
        {a.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </details>
  );
}
