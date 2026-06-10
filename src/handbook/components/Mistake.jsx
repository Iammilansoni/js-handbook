import { Code } from "./Code";
export function Mistake({ label, wrong, right, why }) {
  return (
    <div className="hb-mistake">
      {label && <h4 style={{ margin: "0 0 12px", color: "var(--hb-fg)", fontSize: 15 }}>{label}</h4>}
      <div className="hb-mistake-col wrong">
        <div className="hb-mistake-label">Wrong</div>
        <Code>{wrong}</Code>
      </div>
      <div className="hb-mistake-col right">
        <div className="hb-mistake-label">Right</div>
        <Code>{right}</Code>
      </div>
      <div className="hb-mistake-why"><strong>Why:</strong> {why}</div>
    </div>
  );
}
