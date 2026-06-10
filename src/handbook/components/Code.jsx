import { useMemo, useState } from "react";

const KEYWORDS = new Set([
  "var","let","const","function","return","if","else","for","while","do",
  "switch","case","break","continue","new","class","extends","super","this",
  "typeof","instanceof","in","of","try","catch","finally","throw","import",
  "from","export","default","async","await","yield","void","delete","static",
  "get","set",
]);
const BUILTINS = new Set([
  "console","Math","Object","Array","Promise","JSON","Number","String",
  "Boolean","Symbol","Map","Set","Date","Error","RegExp","window","document",
  "globalThis","undefined",
]);
const BOOLS = new Set(["true","false","null"]);

// Token regex (ordered alternatives)
const TOKEN_RE = new RegExp(
  [
    "(\\/\\/[^\\n]*)",                             // 1 line comment
    "(\\/\\*[\\s\\S]*?\\*\\/)",                    // 2 block comment
    "(`(?:\\\\.|\\$\\{[^}]*\\}|[^`\\\\])*`)",      // 3 template
    "('(?:\\\\.|[^'\\\\\\n])*')",                  // 4 single string
    "(\"(?:\\\\.|[^\"\\\\\\n])*\")",               // 5 double string
    "(\\b\\d+(?:\\.\\d+)?\\b)",                    // 6 number
    "([A-Za-z_$][\\w$]*)(?=\\s*\\()",              // 7 fn call
    "([A-Za-z_$][\\w$]*)",                         // 8 ident
    "([{}()\\[\\];,.:?=+\\-*/%<>!&|^~]+)",        // 9 punctuation
  ].join("|"),
  "g"
);

function tokenize(src) {
  const out = [];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(src)) !== null) {
    if (m.index > last) out.push({ t: "text", v: src.slice(last, m.index) });
    const [full, c1, c2, c3, c4, c5, c6, c7, c8, c9] = m;
    if (c1 || c2) out.push({ t: "comment", v: full });
    else if (c3 || c4 || c5) out.push({ t: "string", v: full });
    else if (c6) out.push({ t: "number", v: full });
    else if (c7) out.push({ t: BUILTINS.has(c7) ? "builtin" : "fn", v: c7 });
    else if (c8) {
      if (KEYWORDS.has(c8)) out.push({ t: "keyword", v: c8 });
      else if (BOOLS.has(c8)) out.push({ t: "bool", v: c8 });
      else if (BUILTINS.has(c8)) out.push({ t: "builtin", v: c8 });
      else out.push({ t: "text", v: c8 });
    }
    else if (c9) out.push({ t: "punct", v: c9 });
    last = m.index + full.length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

export function Code({ children, language = "js" }) {
  const code = String(children ?? "").replace(/^\n/, "").replace(/\s+$/, "");
  const tokens = useMemo(() => tokenize(code), [code]);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="hb-code-wrap">
      <div className="hb-code-bar">
        <span>{language}</span>
        <button type="button" className="hb-code-copy" onClick={onCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="hb-code"><code>
        {tokens.map((tok, i) =>
          tok.t === "text"
            ? tok.v
            : <span key={i} className={`tok-${tok.t}`}>{tok.v}</span>
        )}
      </code></pre>
    </div>
  );
}
