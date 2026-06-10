export function Section({ eyebrow, title, action, children, id }) {
  const sectionId = id || (eyebrow || title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const humanTitle = eyebrow || title || "Section";
  
  return (
    <section className="hb-section" id={sectionId} data-title={humanTitle}>
      <div className="hb-section-head">
        <div className="hb-section-head-left">
          {eyebrow && <span className="hb-section-eyebrow">{eyebrow}</span>}
          {title && <h2 className="hb-section-title">{title}</h2>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
