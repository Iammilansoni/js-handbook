const MAP = {
  Beginner:     "var(--hb-green)",
  Intermediate: "var(--hb-blue)",
  Advanced:     "var(--hb-amber)",
  FAANG:        "var(--hb-red)",
};
export function Badge({ level = "Beginner", children }) {
  const color = MAP[level] ?? "var(--hb-fg-muted)";
  return (
    <span className="hb-badge" style={{ "--hb-badge": color }}>
      {children ?? level}
    </span>
  );
}
