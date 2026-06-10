import { useState } from "react";
import { CheckCircle2, XCircle, Play } from "lucide-react";

export function CodeChallenge({ challenge, accent }) {
  if (!challenge) return null;

  const [code, setCode] = useState(() => challenge.initialCode.replace(/\\n/g, '\n'));
  const [results, setResults] = useState(null);

  const runCode = () => {
    const newResults = challenge.testCases.map((tc, idx) => {
      try {
        // Create an evaluator function.
        // If there's a setup string, we run that instead of a generic invoke.
        let evalStr = `
          ${code}
          ${tc.setup ? tc.setup : `return solve(...${tc.input || '[]'});`}
        `;
        
        // Use new Function to safely evaluate local code.
        const fn = new Function(evalStr);
        const result = fn();
        
        // Expected value parsing
        const expectedFn = new Function(`return ${tc.expected}`);
        const expectedVal = expectedFn();

        // Deep equality check for arrays/objects, simple strict equality for primitives
        const passed = JSON.stringify(result) === JSON.stringify(expectedVal);

        return { passed, actual: result, expected: expectedVal, error: null };
      } catch (err) {
        return { passed: false, actual: null, expected: tc.expected, error: err.message };
      }
    });

    setResults(newResults);
  };

  return (
    <div style={{ marginTop: 40, borderRadius: "var(--border-radius-lg)", border: "1px solid var(--color-border-primary)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: "var(--color-background-secondary)", borderBottom: "1px solid var(--color-border-primary)" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "var(--hb-fg)", display: "flex", alignItems: "center", gap: 8 }}>
          <Play size={16} color={accent} /> Interactive Challenge: {challenge.title}
        </h3>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--hb-fg-muted)", lineHeight: 1.5 }}>
          {challenge.description}
        </p>
      </div>

      <div style={{ background: "var(--color-bg-code)", padding: 16 }}>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%", minHeight: 180, background: "transparent", 
            border: "none", color: "var(--color-blue)", fontFamily: "var(--font-mono)", 
            fontSize: 14, lineHeight: 1.5, resize: "vertical", outline: "none"
          }}
        />
      </div>

      <div style={{ padding: "12px 16px", background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={runCode}
          style={{
            background: accent, color: "#000", border: "none", padding: "8px 16px", 
            borderRadius: "var(--border-radius-md)", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, fontSize: 14
          }}
        >
          <Play size={14} /> Run Tests
        </button>
      </div>

      {results && (
        <div style={{ padding: "16px 20px", background: "var(--color-background-primary)" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 14, color: "var(--hb-fg)" }}>Test Results</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map((res, i) => (
              <li key={i} style={{ 
                display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, 
                color: res.passed ? "var(--color-green)" : "var(--color-red)",
                background: res.passed ? "var(--color-bg-green)" : "var(--color-bg-red)",
                padding: "10px 12px", borderRadius: "var(--border-radius-md)"
              }}>
                {res.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <div>
                  <div style={{ fontWeight: 500 }}>Test Case {i + 1}</div>
                  {!res.passed && (
                    <div style={{ marginTop: 4, opacity: 0.9, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {res.error ? (
                        <span>Error: {res.error}</span>
                      ) : (
                        <span>Expected: {JSON.stringify(res.expected)} | Got: {JSON.stringify(res.actual)}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
