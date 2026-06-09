import { useState, useMemo } from "react";

const highlight = (code) => {
  if (!code) return "";
  const token = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'`])((?:\\.|(?!\2)[\s\S])*?)\2|\b(const|let|var|function|return|if|else|for|while|class|extends|super|new|this|typeof|instanceof|import|export|default|from|async|await|try|catch|finally|throw|of|in|true|false|null|undefined|static|get|set)\b|\b(\d+\.?\d*)\b|\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;
  return code
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(token, (match, comment, quote, body, keyword, number, fn) => {
      const color = comment ? "--c-cmt" : quote ? "--c-str" : keyword ? "--c-kw" : number ? "--c-num" : fn ? "--c-fn" : null;
      return color ? `<span style="color:var(${color})">${match}</span>` : match;
    });
};

const Code = ({ code, label }) => (
  <div style={{margin:"12px 0",borderRadius:"var(--border-radius-lg)",overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
    {label && <div style={{padding:"6px 14px",background:"var(--color-background-secondary)",fontSize:11,color:"var(--color-text-tertiary)",borderBottom:"0.5px solid var(--color-border-tertiary)",fontFamily:"var(--font-mono)"}}>{label}</div>}
    <pre style={{margin:0,padding:"14px 16px",background:"var(--color-background-secondary)",overflowX:"auto",fontSize:12.5,lineHeight:1.75,fontFamily:"var(--font-mono)"}}
      dangerouslySetInnerHTML={{__html:highlight(code)}}/>
  </div>
);

const Cmp = ({ headers, rows }) => (
  <div style={{overflowX:"auto",margin:"12px 0"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr>{headers.map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:"left",fontWeight:500,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",color:"var(--color-text-primary)"}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row,ri)=><tr key={ri}>{row.map((cell,ci)=><td key={ci} style={{padding:"8px 12px",border:"0.5px solid var(--color-border-tertiary)",color:ci===0?"var(--color-text-primary)":"var(--color-text-secondary)",fontFamily:ci>0?"inherit":"var(--font-mono)",fontSize:ci===0?12:13}}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const Badge = ({ level }) => {
  const map = { beginner:{bg:"var(--color-background-success)",c:"var(--color-text-success)",label:"beginner"}, intermediate:{bg:"var(--color-background-info)",c:"var(--color-text-info)",label:"intermediate"}, advanced:{bg:"var(--color-background-warning)",c:"var(--color-text-warning)",label:"advanced"}, faang:{bg:"var(--color-background-danger)",c:"var(--color-text-danger)",label:"faang"} };
  const s = map[level] || map.beginner;
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:s.bg,color:s.c,fontWeight:500}}>{s.label}</span>;
};

const COLORS = { amber:"var(--color-text-warning)", purple:"var(--color-text-info)", teal:"#0F6E56", blue:"var(--color-text-info)", coral:"#993C1D", green:"#3B6D11", pink:"#993556", gray:"var(--color-text-secondary)" };
const BG_COLORS = { amber:"var(--color-background-warning)", purple:"var(--color-background-info)", teal:"#E1F5EE", blue:"var(--color-background-info)", coral:"#FAECE7", green:"#EAF3DE", pink:"#FBEAF0", gray:"var(--color-background-secondary)" };


const TOPICS = [
{
  id:1, icon:"ti-variable", color:"amber", title:"var / let / const", subtitle:"Hoisting & Scope",
  overview:{
    definition:"Three ways to declare variables. var is function-scoped and hoisted with undefined. let is block-scoped and enters a Temporal Dead Zone. const is block-scoped, must be initialized, and its reference cannot be reassigned.",
    why:"JavaScript originally only had var, which caused bugs from function scope and hoisting quirks. let and const were added in ES6 to give block-level scoping and safer semantics.",
    react:"const for all component definitions, let for values that change inside hooks, understanding scope prevents stale closure bugs in useEffect.",
    node:"const for all require() imports, const for configuration, let for values that change across retry loops.",
    express:"const app = express(), const router = express.Router(), const PORT = process.env.PORT || 3000.",
    interview:"Tests foundational understanding of scope — the #1 JavaScript concept. Interviewers use this to distinguish who truly understands JavaScript from who just uses it."
  },
  mentalModel:{
    analogy:"Think of variable declarations as parking spaces in a building. var reserves a space anywhere in the whole building (function). let reserves a space only on your floor (block), but cones it off until you arrive (TDZ). const parks a car permanently — you can change the car's interior (mutate objects) but cannot swap the car (reassign).",
    visual:`SCOPE VISUALIZATION:
┌─────────────────────────────────────┐
│  FUNCTION SCOPE (var lives here)   │
│   a = undefined → 10               │
│  ┌───────────────────────────────┐ │
│  │  BLOCK SCOPE { }              │ │
│  │   b = [TDZ] → 20  (let)      │ │
│  │   c = 30          (const)     │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘`,
    misconceptions:[
      ["const means the value can't change","const means the REFERENCE can't change. Object properties ARE mutable."],
      ["let and const are not hoisted","They ARE hoisted, but placed in TDZ — access before declaration throws ReferenceError."],
      ["Hoisting moves code physically","Hoisting is a compilation phase behavior, not text movement."],
    ]
  },
  theory:[
    { title:"Hoisting — what actually happens",
      desc:"During the compilation phase, before code runs, the engine scans all declarations. var is hoisted and initialized to undefined. let and const are hoisted but left UNINITIALIZED (TDZ). Function declarations are fully hoisted.",
      code:`// What you write:
console.log(a);      // undefined (hoisted)
console.log(greet);  // [Function: greet] (fully hoisted)
var a = 5;
function greet() { return "hello"; }

// What the engine does internally:
var a = undefined;        // hoisted, initialized
function greet() { return "hello"; } // fully hoisted
console.log(a);
console.log(greet);
a = 5;` },
    { title:"Temporal Dead Zone (TDZ)",
      desc:"The TDZ is the period between when a let/const variable enters scope (hoisted) and when it reaches its declaration line. Accessing it throws ReferenceError — a safety feature.",
      code:`// TDZ for 'name' starts here ↓
console.log(name); // ReferenceError!
// TDZ for 'name' ends here ↓
let name = "Alice";
console.log(name); // "Alice"

// typeof is NOT safe in TDZ
typeof undeclaredVar; // "undefined" — no error
typeof name;          // ReferenceError if in TDZ!` },
    { title:"const with objects and arrays",
      desc:"const prevents reassignment of the binding (the reference), not mutation of the value. Objects and arrays stored in const can still be modified.",
      code:`const user = { name: "Alice", age: 25 };
user.age = 26;          // OK — mutating the object
user.city = "London";   // OK — adding a property
user = { name: "Bob" }; // TypeError — reassigning const!

// To truly freeze an object:
const config = Object.freeze({ debug: false });
config.debug = true; // Silently fails (throws in strict mode)

const arr = [1, 2, 3];
arr.push(4);    // OK — mutating the array
arr = [5, 6];   // TypeError — reassigning const!` },
    { title:"The classic loop + closure bug",
      desc:"Using var in loops with async callbacks (setTimeout, event handlers) is one of the most famous JavaScript bugs. All callbacks share the same var-scoped variable.",
      code:`// BUG: var is function-scoped — all closures share i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (not 0, 1, 2!)

// FIX 1: let creates a new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅

// FIX 2: IIFE to capture current value
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}` },
  ],
  comparison:{
    headers:["Feature","var","let","const"],
    rows:[
      ["Scope","Function","Block","Block"],
      ["Hoisted as","undefined","TDZ (uninitialized)","TDZ (uninitialized)"],
      ["Re-declarable","Yes","No (SyntaxError)","No (SyntaxError)"],
      ["Reassignable","Yes","Yes","No (TypeError)"],
      ["Attached to window","Yes (global)","No","No"],
      ["Use in modern code","Avoid","When value changes","Default choice"],
    ]
  },
  mistakes:[
    { label:"Assuming const = immutable object",
      wrong:`const settings = { theme: "dark" };
settings = { theme: "light" }; // ❌ TypeError`,
      right:`const settings = { theme: "dark" };
settings.theme = "light"; // ✅ Mutation is allowed
// For true immutability:
const frozen = Object.freeze({ theme: "dark" });`,
      why:"const prevents reassigning the reference, not mutating the object. Object.freeze() creates a shallow immutable object." },
    { label:"var in block — expecting block scope",
      wrong:`if (true) {
  var message = "Hello";  // leaks out!
}
console.log(message); // "Hello" — unexpected`,
      right:`if (true) {
  let message = "Hello"; // block-scoped
}
console.log(message); // ReferenceError ✅`,
      why:"var is function-scoped and leaks out of blocks. Always use let or const inside blocks." },
    { label:"Missing declaration keyword (global leak)",
      wrong:`function bad() {
  secret = "exposed"; // No declaration!
  // Becomes window.secret globally!
}`,
      right:`"use strict"; // Enables strict mode
function good() {
  const secret = "safe"; // Properly declared
}`,
      why:"Without a declaration keyword, assignment creates a global variable. 'use strict' turns this into a ReferenceError." },
  ],
  interview:[
    { level:"beginner", q:"What is the difference between var, let, and const?",
      a:"var is function-scoped, hoisted as undefined, and can be re-declared. let is block-scoped, hoisted into TDZ, cannot be re-declared, but can be reassigned. const is block-scoped, hoisted into TDZ, cannot be re-declared or reassigned (but object properties can still be mutated)." },
    { level:"beginner", q:"What is hoisting?",
      a:"Hoisting is JavaScript's behavior during the compilation phase where variable and function declarations are processed before code executes. var declarations are hoisted and initialized to undefined. let/const are hoisted but remain uninitialized (TDZ). Function declarations are fully hoisted with their body." },
    { level:"intermediate", q:"What is the Temporal Dead Zone?",
      a:"The TDZ is the period between when a let or const variable enters scope (is hoisted) and when it's initialized at its declaration line. Accessing it during this period throws a ReferenceError. This is a deliberate safety feature to prevent using variables before they're defined." },
    { level:"advanced", q:"What will this output? var x=1; function f(){console.log(x); var x=2;} f();",
      a:"It outputs undefined. The inner var x is hoisted to the top of f(), shadowing the outer x. So inside f(), x exists but is undefined before the assignment. This demonstrates hoisting + variable shadowing together." },
    { level:"faang", q:"How does V8 optimize const differently from let?",
      a:"const allows V8 to make stronger assumptions — the reference won't change, so V8 can apply constant folding (inlining the value), better inline caching, and dead code elimination. let and var require V8 to check for changes at each access, potentially preventing some JIT optimizations." },
  ],
  cheatsheet:[
    "Default to const → let only when reassigning → never use var",
    "const + primitive = truly immutable; const + object = mutable properties",
    "TDZ: let/const hoisted but inaccessible until declaration line",
    "var leaks from blocks; let/const are block-contained",
    "Loop with var + async = classic bug → fix with let",
    "typeof is NOT safe with TDZ variables (throws ReferenceError)",
    "Function declarations fully hoisted; function expressions are not",
    "Missing declaration keyword → accidental global (use 'use strict')",
  ]
},
{
  id:2, icon:"ti-pointer", color:"purple", title:"this keyword", subtitle:"Execution Context & Binding",
  overview:{
    definition:"this refers to the object currently executing the code. Its value is NOT determined by where a function is defined, but by HOW it is called (the call site). There are four binding rules in priority order: new, explicit (call/apply/bind), implicit (obj.fn()), and default.",
    why:"JavaScript needed a way for methods to access the object they belong to. Without this, every method would need the object name hardcoded, making reuse impossible.",
    react:"Class components: this.state, this.setState(), binding event handlers in constructor. Arrow class properties solve binding automatically.",
    node:"Event emitter callbacks, class-based services, Express controllers all rely on this binding.",
    express:"Class-based route controllers need this bound — either in constructor or using arrow methods.",
    interview:"Tests deep understanding of JavaScript's execution model. One of the most nuanced topics — distinguishes junior from senior engineers."
  },
  mentalModel:{
    analogy:"Think of this as caller ID on a phone. The same phone (function) can be called by different people (objects). this tells you WHO is on the other end. The function doesn't know who'll call it — it only knows when the call arrives.",
    visual:`BINDING PRIORITY (highest → lowest):
┌──────────────────────────────────────┐
│ 1. new Foo()        → new object     │
│ 2. fn.call(obj)     → obj            │
│    fn.apply(obj)    → obj            │
│    fn.bind(obj)()   → obj            │
│ 3. obj.fn()         → obj (implicit) │
│ 4. fn()             → window/undef   │
│ Arrow functions     → LEXICAL (never │
│                       changes)        │
└──────────────────────────────────────┘`,
    misconceptions:[
      ["this refers to the function itself","this is the calling context, not the function"],
      ["this is set when function is defined","this is set when the function is CALLED"],
      ["Arrow functions have their own this","Arrows inherit this from enclosing lexical scope"],
    ]
  },
  theory:[
    { title:"The four binding rules",
      desc:"Default: standalone call → global or undefined in strict. Implicit: obj.method() → obj. Explicit: call/apply/bind forces a specific object. New: new Fn() creates a new object and sets this to it.",
      code:`function showThis() { console.log(this); }

// 1. DEFAULT — standalone call
showThis(); // window (non-strict) / undefined (strict)

// 2. IMPLICIT — method call
const obj = { name: "Alice", showThis };
obj.showThis(); // obj { name: "Alice", ... }

// 3. EXPLICIT — call/apply/bind
showThis.call({ name: "Bob" }); // { name: "Bob" }
showThis.apply({ name: "Charlie" }, []); // { name: "Charlie" }
const bound = showThis.bind({ name: "Dave" });
bound(); // { name: "Dave" }

// 4. NEW
function Person(name) { this.name = name; }
const alice = new Person("Alice"); // this = new {}` },
    { title:"call vs apply vs bind",
      desc:"All three explicitly set this. call and apply invoke immediately; bind returns a new function. call takes args comma-separated; apply takes an array; bind supports partial application.",
      code:`function greet(prefix, suffix) {
  return \`\${prefix} \${this.name}\${suffix}\`;
}
const user = { name: "Alice" };

greet.call(user, "Hello,", "!");    // "Hello, Alice!"
greet.apply(user, ["Hello,", "!"]); // "Hello, Alice!"

const aliceGreet = greet.bind(user, "Hi,");
aliceGreet("!"); // "Hi, Alice!" (prefix is pre-filled)
aliceGreet("?"); // "Hi, Alice?"` },
    { title:"Arrow functions — no own this",
      desc:"Arrow functions don't create their own execution context — they inherit this from their enclosing lexical scope (where they are written, not called). This makes them ideal for callbacks.",
      code:`const team = {
  name: "Dev Team",
  members: ["Alice", "Bob"],

  printRegular() {
    this.members.forEach(function(m) {
      // 'this' = window here! Lost implicit binding
      console.log(m + " from " + this.name); // undefined
    });
  },

  printArrow() {
    this.members.forEach(m => {
      // Arrow inherits 'this' from printArrow's context
      console.log(m + " from " + this.name); // "Dev Team" ✅
    });
  }
};

// Arrow as object METHOD — this = outer scope (NOT the object!)
const obj = {
  name: "Alice",
  greet: () => console.log(this.name) // undefined!
};` },
    { title:"Class component binding (React)",
      desc:"In React class components, event handlers lose this when passed as callbacks. Three patterns solve this: constructor binding, arrow in JSX (new fn per render), or arrow class property (modern standard).",
      code:`class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // Pattern 1: bind in constructor (traditional)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(p => ({ count: p.count + 1 }));
  }

  // Pattern 2: Arrow class property (modern — recommended)
  handleReset = () => {
    this.setState({ count: 0 }); // 'this' always correct
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>+</button>
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}` },
  ],
  comparison:{
    headers:["Method","Invokes Now","Args format","Returns","this"],
    rows:[
      ["call(obj, a, b)","Yes","Comma-separated","Result of fn","obj"],
      ["apply(obj, [a,b])","Yes","Array","Result of fn","obj"],
      ["bind(obj, a)","No","Comma-separated","New function","obj (permanent)"],
      ["new Fn()","Yes","Constructor args","New object","New object"],
      ["Arrow () => {}","N/A","N/A","N/A","Lexical (inherited)"],
    ]
  },
  mistakes:[
    { label:"Losing this when extracting methods",
      wrong:`const { greet } = user;
greet(); // this = window, not user!`,
      right:`const greet = user.greet.bind(user);
greet(); // this = user ✅
// Or: const greet = () => user.greet();`,
      why:"Destructuring extracts the function reference without its object context. Use bind or a wrapper arrow function." },
    { label:"Arrow function as object method",
      wrong:`const obj = {
  name: "Alice",
  greet: () => console.log(this.name) // undefined!
};`,
      right:`const obj = {
  name: "Alice",
  greet() { console.log(this.name); } // "Alice" ✅
};`,
      why:"Arrow functions inherit this from definition scope. At the object literal level, that's the outer scope (not the object). Use shorthand method syntax instead." },
    { label:"Nested function losing this",
      wrong:`const obj = {
  val: 42,
  process() {
    function helper() {
      return this.val; // undefined — lost!
    }
    return helper();
  }
};`,
      right:`const obj = {
  val: 42,
  process() {
    const helper = () => this.val; // inherits ✅
    return helper();
  }
};`,
      why:"Nested regular functions get default binding (window/undefined). Use arrow functions to inherit the outer this." },
  ],
  interview:[
    { level:"beginner", q:"What is this in JavaScript?",
      a:"this refers to the object currently executing the code. Its value is determined by the call site — how the function is called. In a method call (obj.fn()), this is obj. In a standalone call, it's window (non-strict) or undefined (strict). Arrow functions inherit this from their lexical scope." },
    { level:"intermediate", q:"Why don't arrow functions have their own this?",
      a:"Arrow functions were designed as lightweight function expressions without their own execution context. They capture this from the enclosing scope where they are written (lexical this). This makes them ideal for callbacks and nested functions where you want to preserve the outer this." },
    { level:"advanced", q:"Can you re-bind an arrow function with call/apply/bind?",
      a:"No. Arrow functions permanently capture this from their lexical environment. Calling arrow.call(obj) still uses the lexical this — the argument is ignored. This is why arrows cannot be used as constructors." },
    { level:"advanced", q:"Implement a polyfill for Function.prototype.bind.",
      a:"Store a reference to the original function. Return a new function that uses apply(thisArg, [...presetArgs, ...callArgs]). Handle the new keyword by checking instanceof and using the original prototype. The bound function's prototype should be Object.create(originalFn.prototype)." },
    { level:"faang", q:"What is this in a class static method?",
      a:"In a static method, this refers to the CLASS itself (not an instance). This allows static methods to call other static methods via this.otherStaticMethod(). It also means static methods don't have access to instance properties." },
  ],
  cheatsheet:[
    "this is determined at call time, not definition time",
    "Priority: new > explicit (call/apply/bind) > implicit (obj.fn()) > default (fn())",
    "Arrow functions NEVER have their own this — always lexical",
    "Extracting a method loses implicit binding — use bind()",
    "Arrow as object method = anti-pattern (this = outer scope, not object)",
    "Class arrow properties solve React handler binding",
    "bind() creates a new function; call()/apply() invoke immediately",
    "call: comma args | apply: array args | bind: returns new fn",
  ]
},
{
  id:3, icon:"ti-lock", color:"teal", title:"Closures", subtitle:"Lexical Scope & Memory",
  overview:{
    definition:"A closure is a function that retains access to variables from its outer (enclosing) scope even after that outer function has returned. Every function in JavaScript is a closure — it carries a reference to the scope where it was defined.",
    why:"JavaScript's event-driven, callback-heavy model requires functions to carry their environment with them when passed around. Closures package a function with its surrounding state.",
    react:"useState is built on closures. useEffect closures cause stale closure bugs. useCallback and useMemo use closures to cache. Every event handler in React is a closure.",
    node:"Middleware factories, module encapsulation, async callbacks, event handlers — all rely on closures.",
    express:"Rate limiting middleware factories, authentication closures, route handler factories all use closure patterns.",
    interview:"If you understand closures deeply, you understand scope, memory, and the module pattern. FAANG interviewers use closures to separate junior from senior engineers."
  },
  mentalModel:{
    analogy:"A closure is a function with a backpack. When created, it packs up all outer variables it references and carries them wherever it goes. Even after the outer function finishes, the inner function still has its backpack with those variables — they're alive as long as the closure exists.",
    visual:`CLOSURE MEMORY MODEL:
makeCounter() called → 'count' created in heap
makeCounter() returns → stack frame removed
BUT: inner function holds [[Environment]] → count stays!

┌────────────────────────────────────────┐
│  HEAP (persists as long as closure)   │
│  ┌──────────────────────────────────┐ │
│  │  Closure Env: { count: 2 }      │ │
│  │       ↑                          │ │
│  │  increment() → references this   │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘`,
    misconceptions:[
      ["Closures copy captured variables","Closures capture LIVE REFERENCES — changes are reflected"],
      ["return is required for a closure","Any function accessing outer scope is a closure"],
      ["Closures always cause memory leaks","Only if references are held longer than needed"],
    ]
  },
  theory:[
    { title:"Closures capture live references",
      desc:"Closures don't snapshot values — they hold a live reference to the variable binding. If the outer variable changes, the closure sees the new value.",
      code:`function liveReference() {
  let count = 0;

  const read = () => count;           // reads 'count' by reference
  const increment = () => ++count;    // writes 'count' by reference

  return { read, increment };
}

const { read, increment } = liveReference();
console.log(read());      // 0
increment();
increment();
console.log(read());      // 2 — same 'count' variable!` },
    { title:"Module pattern — private state via closures",
      desc:"The module pattern uses closures to create private state and expose a public API. This is how JavaScript achieves encapsulation without classes.",
      code:`const BankAccount = (function() {
  let balance = 0;  // PRIVATE — inaccessible from outside

  function validate(amount) {
    if (amount <= 0) throw new Error("Invalid amount");
  }

  return {  // PUBLIC interface
    deposit(amount) {
      validate(amount);
      balance += amount;
      return this;       // enable chaining
    },
    withdraw(amount) {
      validate(amount);
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return this;
    },
    getBalance: () => balance
  };
})();

BankAccount.deposit(100).deposit(50).withdraw(30);
console.log(BankAccount.getBalance()); // 120
console.log(BankAccount.balance);      // undefined — private!` },
    { title:"Memoization using closures",
      desc:"Memoization is an optimization technique that caches function results. The cache lives in the closure — private and persistent across calls.",
      code:`function memoize(fn) {
  const cache = new Map(); // private cache in closure

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key); // cache hit!
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return expensiveFib(n-1) + expensiveFib(n-2);
});

expensiveFib(40); // Computed once — then cached` },
    { title:"Stale closures in React (critical bug)",
      desc:"A stale closure occurs when a useEffect captures a value from an earlier render and doesn't update when that value changes. This is one of the most common React bugs.",
      code:`function Counter() {
  const [count, setCount] = useState(0);

  // BUG: Stale closure — 'count' is captured as 0 forever
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // always 0 + 1 = 1!
    }, 1000);
    return () => clearInterval(timer);
  }, []); // empty deps = closure never refreshes

  // FIX 1: Functional update (doesn't depend on closure)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1); // always gets current value ✅
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // FIX 2: Add count to deps (effect re-runs on change)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // fresh count each re-run
    }, 1000);
    return () => clearInterval(timer);
  }, [count]); // ✅
}` },
  ],
  comparison:{
    headers:["Pattern","Uses Closure","State Private","Use Case"],
    rows:[
      ["Global variable","No","No","Shared app state (avoid)"],
      ["Module pattern (IIFE)","Yes","Yes","Encapsulated module"],
      ["Factory function","Yes","Yes","Multiple independent instances"],
      ["Class","No (uses this)","No","OOP with inheritance"],
      ["React custom hook","Yes","Partially","Reusable stateful logic"],
      ["WeakMap private","Yes","Yes","Per-instance private data"],
    ]
  },
  mistakes:[
    { label:"Stale closure in useEffect",
      wrong:`useEffect(() => {
  fetchData(userId); // userId might be stale!
}, []); // missing userId in deps`,
      right:`useEffect(() => {
  fetchData(userId); // fresh userId each run
}, [userId]); // ✅ dep declared`,
      why:"The closure captures userId from a specific render. If userId changes, the effect doesn't re-run and uses the old value. Always declare dependencies." },
    { label:"Loop + var + closure",
      wrong:`for (var i = 0; i < 3; i++) {
  fns.push(() => i); // all capture same 'i'
}
fns[0](); // 3 (not 0!)`,
      right:`for (let i = 0; i < 3; i++) {
  fns.push(() => i); // each has own 'i'
}
fns[0](); // 0 ✅`,
      why:"var is function-scoped — all closures share the same i. let creates a new binding per iteration." },
    { label:"Closure holding large data unnecessarily",
      wrong:`function process(largeArray) {
  const result = compute(largeArray);
  return () => result;
  // 'largeArray' also kept alive in closure!
}`,
      right:`function process(largeArray) {
  const result = compute(largeArray);
  // largeArray = null; // explicitly release it
  return () => result; // only 'result' referenced
}`,
      why:"V8 closures can hold references to ALL variables in scope, even unused ones. Nullify large objects after use." },
  ],
  interview:[
    { level:"beginner", q:"What is a closure?",
      a:"A closure is a function that retains access to variables from its outer scope even after the outer function has returned. It's created every time a function is created in JavaScript. Closures enable data privacy, stateful functions, and patterns like memoization and the module pattern." },
    { level:"intermediate", q:"Do closures capture values or references?",
      a:"Closures capture live references, not snapshots. If the outer variable changes after the closure is created, the closure sees the new value. This is why the for-var-loop bug occurs (all closures reference the same variable) and why stale closures in React happen (the captured state value is from an earlier render)." },
    { level:"advanced", q:"What is a stale closure in React and how do you fix it?",
      a:"A stale closure occurs when a useEffect (or useCallback) captures a value from a previous render without updating when that value changes. Fix: 1) Add the value to the dependency array. 2) Use functional state updates (setState(prev => prev + 1)) which don't depend on closed-over values. 3) Use useRef to hold a mutable reference." },
    { level:"faang", q:"Implement memoize with TTL and max cache size.",
      a:"Return a function that checks a Map cache with JSON.stringify(args) as key. For TTL, store the result with a timestamp and evict if Date.now() - timestamp > ttl. For max size, evict the oldest entry (first key in Map) when at capacity. Use cache.keys().next().value to get the oldest key (Map preserves insertion order)." },
    { level:"faang", q:"How does V8 handle closure memory? When is it freed?",
      a:"V8 creates a 'Context' object in the heap when a closure is formed, containing all variables referenced by the inner function. This Context persists as long as any closure references it. When the closure itself becomes unreachable (the variable holding it is set to null or goes out of scope), the Context becomes eligible for garbage collection." },
  ],
  cheatsheet:[
    "Closure = function + its surrounding scope environment",
    "Closures capture LIVE REFERENCES, not snapshots",
    "Every function in JS is a closure",
    "Module pattern: IIFE + return public API = private state",
    "Memoize: cache in closure, Map for key-value storage",
    "Stale closure: fix with functional update or deps array",
    "Memory: closures prevent GC of captured variables — be intentional",
    "var loop + closure = bug; let loop + closure = correct",
  ]
},
{
  id:4, icon:"ti-function", color:"blue", title:"Higher-Order Functions", subtitle:"Callbacks & Functional Patterns",
  overview:{
    definition:"A Higher-Order Function (HOF) takes one or more functions as arguments, returns a function, or both. A callback is a function passed as an argument to another function. JavaScript treats functions as first-class citizens — they can be stored in variables, passed around, and returned like any value.",
    why:"HOFs enable code abstraction, separation of concerns, and powerful functional programming patterns. Instead of writing what to do for each item, you describe the transformation and let the HOF apply it.",
    react:"Array.map() renders lists of components. useEffect, useCallback, useMemo are HOFs. Event handlers are callbacks. Custom hooks return functions.",
    node:"Express middleware is a HOF callback. fs.readFile(path, callback). Event emitters use HOF pattern.",
    express:"app.get('/route', handler). Middleware factories return middleware functions. asyncHandler wraps async route handlers.",
    interview:"map, filter, reduce are interviewed constantly. Understanding HOFs shows functional programming knowledge and ability to write reusable, composable code."
  },
  mentalModel:{
    analogy:"A HOF is like a manager who takes a worker (function) and applies them to a task. The manager (HOF) doesn't care what the worker does internally — you plug in any worker you want. A washing machine is a HOF: you give it clothes (data) + a wash program (callback) and it applies your program to your clothes.",
    visual:`PIPELINE PATTERN:
  data
    │
    ▼ .filter(isActive)    ← select relevant items
    │
    ▼ .map(toDisplayCard)  ← transform each item
    │
    ▼ .reduce(groupBy)     ← accumulate into result
    │
    ▼ final output`,
    misconceptions:[
      ["Callbacks are always async","forEach, map, filter all use SYNCHRONOUS callbacks"],
      ["HOFs are complex advanced features","map/filter/forEach are HOFs you use every day"],
      ["forEach and map are interchangeable","map RETURNS a new array; forEach always returns undefined"],
    ]
  },
  theory:[
    { title:"map, filter, reduce — the core trio",
      desc:"These three HOFs cover 80% of array processing. map transforms, filter selects, reduce accumulates. They're pure — they never mutate the original array.",
      code:`const users = [
  { name: "Alice", age: 25, active: true, score: 92 },
  { name: "Bob",   age: 17, active: false, score: 78 },
  { name: "Carol", age: 30, active: true, score: 88 },
];

// map — transform each element (same length output)
const names = users.map(u => u.name);
// ["Alice", "Bob", "Carol"]

// filter — select elements (shorter or equal output)
const adults = users.filter(u => u.age >= 18 && u.active);
// [Alice, Carol]

// reduce — accumulate to single value
const totalScore = users.reduce((sum, u) => sum + u.score, 0);
// 258

// CHAIN THEM — most common real-world pattern:
const topNames = users
  .filter(u => u.active)          // only active users
  .filter(u => u.score >= 88)     // only high scorers
  .map(u => u.name.toUpperCase()) // transform to display
  .sort();                        // alphabetical
// ["ALICE", "CAROL"]` },
    { title:"reduce — the Swiss Army knife",
      desc:"reduce can implement map, filter, and any other accumulation. The key is that the accumulator can be anything: a number, string, array, or object.",
      code:`const data = ["apple","banana","apple","cherry","banana","apple"];

// Count occurrences (accumulator = object)
const counts = data.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, cherry: 1 }

// Group by property (accumulator = object of arrays)
const users = [
  { name: "Alice", dept: "Eng" },
  { name: "Bob",   dept: "Mkt" },
  { name: "Carol", dept: "Eng" }
];
const byDept = users.reduce((acc, user) => {
  (acc[user.dept] = acc[user.dept] || []).push(user);
  return acc;
}, {});
// { Eng: [Alice, Carol], Mkt: [Bob] }

// Pipeline with reduce
const pipeline = [x => x*2, x => x+1, x => x**2];
const result = pipeline.reduce((val, fn) => fn(val), 3);
// ((3*2)+1)^2 = 49` },
    { title:"Compose and pipe",
      desc:"compose and pipe combine multiple functions into one. pipe applies left-to-right (most readable), compose applies right-to-left (mathematical convention). Both are HOFs that return HOFs.",
      code:`const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x ** 2;

const transform = pipe(double, addTen, square);
transform(3); // square(addTen(double(3))) = square(16) = 256

// Real-world Express middleware as pipe:
const processRequest = pipe(
  authenticate,
  authorize,
  validateBody,
  handleRequest
);` },
    { title:"Building HOFs: once, memoize, debounce",
      desc:"These utility HOFs are commonly asked in interviews. They wrap a function with additional behavior — a fundamental pattern in functional programming.",
      code:`// once — execute fn only the first time
const once = (fn) => {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
};
const initApp = once(() => console.log("App initialized!"));
initApp(); // "App initialized!"
initApp(); // nothing (already called)

// debounce — delay execution until after pause
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
const searchAPI = debounce(query => fetch(\`/search?q=\${query}\`), 300);
// Typing "hello" only fires ONE request after user stops typing

// throttle — limit to once per time window
const throttle = (fn, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
};` },
  ],
  comparison:{
    headers:["Method","Purpose","Returns","Mutates?","Callback returns"],
    rows:[
      ["map","Transform each","New array (same length)","No","Transformed value"],
      ["filter","Select elements","New array (≤ length)","No","Boolean (keep/skip)"],
      ["reduce","Accumulate","Single value (any type)","No","New accumulator"],
      ["forEach","Side effects","undefined","No","(ignored)"],
      ["find","First match","Element or undefined","No","Boolean"],
      ["some","Any match?","Boolean","No","Boolean"],
      ["every","All match?","Boolean","No","Boolean"],
      ["flatMap","Map + flatten","New array","No","Value or array"],
    ]
  },
  mistakes:[
    { label:"Forgetting to return in map",
      wrong:`const doubled = [1,2,3].map(n => {
  n * 2; // No return!
});
// [undefined, undefined, undefined]`,
      right:`const doubled = [1,2,3].map(n => n * 2); // implicit return
// OR: .map(n => { return n * 2; })`,
      why:"Arrow functions with curly braces require an explicit return. Without it, the callback returns undefined, and map builds an array of undefineds." },
    { label:"Using map for side effects",
      wrong:`// map for side effects — wrong tool
users.map(user => console.log(user)); // returns [undef...]`,
      right:`// forEach for side effects
users.forEach(user => console.log(user));
// OR: for...of loop`,
      why:"map is for transformation and returns a new array. For side effects only (logging, DOM updates), use forEach." },
    { label:"Missing initialValue in reduce",
      wrong:`[].reduce((acc, n) => acc + n);
// TypeError: Reduce of empty array with no initial value`,
      right:`[].reduce((acc, n) => acc + n, 0); // 0 — safe`,
      why:"Without an initial value, reduce uses the first element as the accumulator. On empty arrays, this throws. Always provide an initial value." },
  ],
  interview:[
    { level:"beginner", q:"What is a higher-order function?",
      a:"A function that takes one or more functions as arguments, returns a function, or both. Examples from the standard library: map, filter, reduce, setTimeout, addEventListener, Array.sort (takes a comparator function)." },
    { level:"beginner", q:"What is the difference between map and forEach?",
      a:"map transforms each element and returns a NEW array of the same length. forEach executes a callback for each element and always returns undefined — it's only for side effects. Use map when you need the transformed result; use forEach when you only need the side effect." },
    { level:"intermediate", q:"Implement Array.prototype.reduce from scratch.",
      a:`function reduce(arr, callback, initialValue) {
  let acc = initialValue !== undefined ? initialValue : arr[0];
  let start = initialValue !== undefined ? 0 : 1;
  for (let i = start; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }
  return acc;
}` },
    { level:"advanced", q:"What is function composition and why is it useful?",
      a:"Composition combines multiple functions into a single function. pipe(f,g,h)(x) = h(g(f(x))). It enables building complex transformations from small, testable, reusable pieces. Each function has one job (single responsibility). Compose/pipe eliminate intermediate variables and make data flow explicit." },
    { level:"faang", q:"Implement pipe and compose.",
      a:`const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
// pipe: left to right (f then g then h)
// compose: right to left (h then g then f — math convention)` },
  ],
  cheatsheet:[
    "map: transform all → new array same length; ALWAYS returns something",
    "filter: select some → new array smaller or equal",
    "reduce: accumulate → single value of ANY type (number, object, array)",
    "forEach: side effects only → returns undefined",
    "Chain: .filter().map().reduce() is the most common pattern",
    "pipe: left-to-right | compose: right-to-left",
    "Always provide initialValue to reduce (safe for empty arrays)",
    "HOF = takes function as arg OR returns function (or both)",
  ]
},
{
  id:5, icon:"ti-binary-tree", color:"coral", title:"Prototypes", subtitle:"Prototype Chain & Inheritance",
  overview:{
    definition:"Every JavaScript object has a hidden [[Prototype]] link to another object. When you access a property, JS first checks the object itself, then follows this link chain until it finds the property or reaches null. ES6 class syntax is purely syntactic sugar over this prototype system.",
    why:"JavaScript uses prototype-based inheritance instead of class-based. Rather than copying methods into each instance, all instances share ONE copy via the prototype chain — memory-efficient and dynamic.",
    react:"React class components extend React.Component via the prototype chain. Understanding why super(props) is required, and why class methods need binding.",
    node:"EventEmitter is prototype-based. Stream classes, http.IncomingMessage all use prototype inheritance.",
    express:"Express Router and Application objects use prototype chains extensively.",
    interview:"Understanding prototypes shows you understand how JS OOP truly works. ES6 classes are sugar — senior engineers must understand what's underneath."
  },
  mentalModel:{
    analogy:"Think of the prototype chain as a family tree. When you need a property, you first check yourself. If not found, ask your parent. If not there, ask grandparent. Continue until reaching the ancestor of all objects (Object.prototype). If not found there, return undefined.",
    visual:`PROTOTYPE CHAIN:
dog instance
  { name: "Rex" }
  [[Prototype]] ──────►  Dog.prototype
                          { bark: fn, fetch: fn }
                          [[Prototype]] ──────►  Animal.prototype
                                                  { breathe: fn }
                                                  [[Prototype]] ──►  Object.prototype
                                                                      { toString, hasOwnProperty }
                                                                      [[Prototype]] = null (END)`,
    misconceptions:[
      ["class in JS is like class in Java/Python","class is syntactic sugar — prototypes underneath always"],
      ["prototype and __proto__ are the same","prototype is on functions; __proto__ (or [[Prototype]]) is on instances"],
      ["Instances copy methods from prototypes","Instances LINK to prototypes — one shared copy in memory"],
    ]
  },
  theory:[
    { title:"prototype vs [[Prototype]] (__proto__)",
      desc:"The most confusing prototype distinction. Functions have a .prototype property (the object that instances will link to). Instances have an internal [[Prototype]] link (access via Object.getPrototypeOf). They point to the same object.",
      code:`function Dog(name) { this.name = name; }
Dog.prototype.bark = function() {
  return this.name + " says Woof!";
};

const rex = new Dog("Rex");

// .prototype is on the CONSTRUCTOR FUNCTION:
console.log(Dog.prototype); // { bark: fn, constructor: Dog }

// [[Prototype]] is on the INSTANCE:
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true
console.log(rex.__proto__ === Dog.prototype); // true (legacy)

rex.bark(); // "Rex says Woof!" — found via prototype chain
rex.hasOwnProperty("name"); // true — own property
rex.hasOwnProperty("bark"); // false — inherited` },
    { title:"ES6 class = syntactic sugar",
      desc:"Every class feature maps directly to prototype mechanics. class makes it cleaner to write but the runtime behavior is identical to constructor functions.",
      code:`// PROTOTYPE WAY (pre-ES6):
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() {
  return this.name + " makes noise";
};
function Dog(name) {
  Animal.call(this, name);          // call parent constructor
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;    // restore constructor ref
Dog.prototype.bark = function() { return this.name + " barks"; };

// CLASS WAY (ES6) — identical behavior:
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes noise\`; } // → Animal.prototype.speak
}

class Dog extends Animal {       // Dog.prototype → Animal.prototype
  constructor(name) { super(name); } // → Animal.call(this, name)
  bark() { return \`\${this.name} barks\`; } // → Dog.prototype.bark
}

const rex = new Dog("Rex");
rex.bark();    // "Rex barks"
rex.speak();   // "Rex makes noise" (from Animal.prototype via chain)

// Proof it's still prototypes:
Dog.prototype === Object.getPrototypeOf(rex); // true` },
    { title:"instanceof and hasOwnProperty",
      desc:"instanceof checks if a constructor's prototype is anywhere in the instance's chain. hasOwnProperty (or Object.hasOwn) checks ONLY own properties — not inherited ones.",
      code:`rex instanceof Dog;     // true
rex instanceof Animal;  // true (Animal.prototype in chain!)
rex instanceof Object;  // true (always — Object.prototype is always there)

// hasOwnProperty: own vs inherited
rex.hasOwnProperty("name");  // true — set in constructor
rex.hasOwnProperty("bark");  // false — on Dog.prototype
Object.hasOwn(rex, "name");  // true — ES2022+ preferred

// Safe iteration — own properties only:
for (const key in rex) {
  if (Object.hasOwn(rex, key)) {
    console.log(key, rex[key]); // only own props
  }
}
Object.keys(rex); // ["name"] — only own enumerable props` },
    { title:"Implement new from scratch",
      desc:"Understanding what new does internally is a key interview question. It creates an object, sets its prototype, runs the constructor, and returns the object.",
      code:`function myNew(Constructor, ...args) {
  // 1. Create blank object with Constructor's prototype
  const obj = Object.create(Constructor.prototype);

  // 2. Run constructor with 'this' = new object
  const result = Constructor.apply(obj, args);

  // 3. If constructor returns an object, use that; else use obj
  return (result !== null && typeof result === "object")
    ? result
    : obj;
}

function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { return this.name + " barks"; };

const rex = myNew(Dog, "Rex");
rex.bark(); // "Rex barks" ✅
rex instanceof Dog; // true (prototype chain is set up correctly)` },
  ],
  comparison:{
    headers:["Aspect","Constructor function","ES6 class","Object.create"],
    rows:[
      ["Syntax","function Foo(){}","class Foo{}","Object.create(proto)"],
      ["Hoisted","Yes (fn hoisting)","No (TDZ)","N/A"],
      ["Method location","Set on .prototype","Auto on .prototype","On proto object"],
      ["Inheritance","Manual + Object.create","extends + super","Object.create(parent)"],
      ["new required","Yes","Yes (strict)","No"],
      ["Readability","Lower","High","Medium"],
    ]
  },
  mistakes:[
    { label:"Overwriting prototype without restoring constructor",
      wrong:`Dog.prototype = { bark() { return "woof"; } };
new Dog().constructor; // Object — not Dog!`,
      right:`Dog.prototype = {
  constructor: Dog, // restore it!
  bark() { return "woof"; }
};`,
      why:"Assigning a new object to .prototype replaces the entire object including the constructor reference. Always restore it, or add methods individually." },
    { label:"Forgetting new with constructor functions",
      wrong:`function User(name) { this.name = name; }
const u = User("Alice"); // this = window!
window.name; // "Alice" — global leak`,
      right:`const u = new User("Alice"); // this = new object ✅`,
      why:"Without new, this inside the constructor function is the global object (window/global), causing property pollution. Use new or switch to ES6 classes." },
    { label:"Prototype pollution from user input",
      wrong:`// Attacker sends: {"__proto__": {"isAdmin": true}}
Object.assign({}, JSON.parse(userInput));
// Now ALL objects have isAdmin = true!`,
      right:`// Use Object.create(null) for data containers
const safeObj = Object.create(null);
// Or validate/sanitize before Object.assign`,
      why:"Prototype pollution attacks inject properties into Object.prototype, affecting all objects. Validate untrusted input and use Object.create(null) for data maps." },
  ],
  interview:[
    { level:"beginner", q:"What is the prototype chain?",
      a:"When you access a property on an object, JavaScript first checks the object's own properties. If not found, it follows the [[Prototype]] link to the next object in the chain. This continues until the property is found or Object.prototype (which has [[Prototype]] = null) is reached, at which point it returns undefined." },
    { level:"intermediate", q:"What is the difference between .prototype and [[Prototype]]?",
      a:".prototype is a property on FUNCTION objects (constructors). It's the object that instances will link to when created with new. [[Prototype]] (accessed via __proto__ or Object.getPrototypeOf) is the internal link on INSTANCES pointing to their prototype. new Dog() sets dog.__proto__ === Dog.prototype." },
    { level:"advanced", q:"How does ES6 class relate to prototypes?",
      a:"ES6 class is purely syntactic sugar over prototypes. The class body's methods are placed on Constructor.prototype. extends sets up the prototype chain (Dog.prototype.__proto__ === Animal.prototype). super() calls the parent constructor. Nothing about classes bypasses the prototype mechanism — it's the exact same runtime behavior, just more readable syntax." },
    { level:"faang", q:"Implement the instanceof operator from scratch.",
      a:`function myInstanceOf(instance, Constructor) {
  let proto = Object.getPrototypeOf(instance);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}` },
    { level:"faang", q:"Implement new from scratch.",
      a:"1) Create new object with Object.create(Constructor.prototype). 2) Call Constructor.apply(obj, args) to run the constructor with this = obj. 3) If the constructor explicitly returns an object, return that; otherwise return obj. This matches the exact behavior of the new keyword." },
  ],
  cheatsheet:[
    "Every object has [[Prototype]] link → prototype chain",
    "Property lookup: own → prototype → prototype's prototype → null",
    ".prototype is on FUNCTIONS; __proto__ is on INSTANCES",
    "class = syntactic sugar (methods → Constructor.prototype automatically)",
    "extends = sets up prototype chain; super() = calls parent constructor",
    "instanceof: checks if Constructor.prototype is anywhere in the chain",
    "Object.hasOwn(obj, key): own properties only (not inherited)",
    "NEVER modify Object.prototype — affects ALL objects (prototype pollution)",
  ]
},
{
  id:6, icon:"ti-sparkles", color:"green", title:"ES6+ Features", subtitle:"Modern JavaScript Syntax",
  overview:{
    definition:"ES6 (2015) and later versions modernized JavaScript with: destructuring (extract values cleanly), spread/rest (...), template literals, optional chaining (?.), nullish coalescing (??), default parameters, ES Modules (import/export), Map/Set data structures, and more.",
    why:"ES6+ features are almost entirely syntactic sugar — they make common patterns cleaner and less error-prone, not fundamentally new capabilities. They reduce boilerplate, make intent clearer, and prevent common bugs.",
    react:"Destructuring props/state, spread for immutable updates, optional chaining for safe access, dynamic imports for code splitting, arrow functions everywhere.",
    node:"ES Modules (import/export) replacing CommonJS, destructuring configs, async/await (see Topic 7).",
    express:"Destructuring request body/params/query, spread for response building, optional chaining for safe middleware access.",
    interview:"You cannot read or write modern JavaScript without fluency in these features. All MERN stack code relies on them heavily."
  },
  mentalModel:{
    analogy:"ES6+ features are shortcuts your team decided to standardize. Instead of writing const name = user.name; const age = user.age; you write const { name, age } = user; — same result, less noise, clearer intent. They're the 'style guide' built into the language.",
    visual:`BEFORE → AFTER:
const x = obj.a; const y = obj.b; → const { a: x, b: y } = obj
arr1.concat(arr2)                 → [...arr1, ...arr2]
a === null ? b : a                → a ?? b
a && a.b && a.b.c                 → a?.b?.c
"Hi " + name + "!"               → \`Hi \${name}!\`
module.exports = Foo              → export default Foo`,
    misconceptions:[
      ["?? and || do the same thing","|| triggers on ANY falsy (0, '', false); ?? only on null/undefined"],
      ["spread creates a deep clone","Spread is SHALLOW — nested objects still share references"],
      ["ESM and CommonJS are interoperable","They have differences in how they handle default exports and live bindings"],
    ]
  },
  theory:[
    { title:"Destructuring — complete patterns",
      desc:"Destructuring extracts values from objects and arrays into variables. It supports renaming, defaults, nested access, and rest — all in one expression.",
      code:`// Object destructuring
const { name, age, role = "user" } = user; // default value
const { name: userName } = user;           // rename
const { address: { city } } = user;        // nested
const { password, ...safeUser } = user;    // rest (exclude password)

// Array destructuring
const [first, second, ...rest] = [1,2,3,4,5];
const [a, , c] = [1,2,3];  // skip element
let x = 1, y = 2;
[x, y] = [y, x];            // swap variables!

// In function parameters (React pattern):
function UserCard({ name, age, role = "user", address: { city = "Unknown" } = {} }) {
  return \`\${name} (\${age}) from \${city} [\${role}]\`;
}

// Combining all features:
const { data: { users: [firstUser] = [] } = {}, status = "idle" } = apiResponse;` },
    { title:"Spread and rest — two sides of ...",
      desc:"Same syntax, opposite roles. Spread EXPANDS an iterable into individual elements. Rest COLLECTS individual elements into an array. Context determines which is which.",
      code:`// SPREAD — expand
const arr1 = [1,2,3], arr2 = [4,5,6];
const merged = [...arr1, ...arr2];      // [1,2,3,4,5,6]
const cloned = [...arr1];               // [1,2,3] — new array

const obj1 = { a: 1 }, obj2 = { b: 2, a: 99 };
const merged2 = { ...obj1, ...obj2 };  // { a: 99, b: 2 } — right overrides

// React: immutable state update
const newState = { ...state, count: state.count + 1 };
const updated = { ...user, address: { ...user.address, city: "London" } };

// REST — collect
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5); // 15

// Important: spread is SHALLOW
const nested = { a: { b: 1 } };
const copy = { ...nested };
copy.a.b = 99;      // ALSO changes nested.a.b!
// Fix: structuredClone(nested) or { ...nested, a: { ...nested.a } }` },
    { title:"Optional chaining and nullish coalescing",
      desc:"Two operators that work together to handle null/undefined safely. Optional chaining prevents TypeError on missing properties. Nullish coalescing provides defaults only for null/undefined (unlike || which catches all falsy values).",
      code:`const user = { name: "Alice", address: { city: "London" } };

// Optional chaining — safe property access
const city = user?.address?.city;       // "London"
const phone = user?.phone?.number;     // undefined (no TypeError!)
const zip = user?.address?.zip;        // undefined
user?.greet?.();                        // undefined (no error if greet missing)
users?.[0]?.name;                       // safe array access

// Nullish coalescing — null/undefined only
const port = process.env.PORT ?? 3000;  // 0 is valid (|| would override 0!)
const name = user?.name ?? "Anonymous"; // only if name is null/undefined

// THE CRITICAL DIFFERENCE:
const val1 = 0 || "default";    // "default" (0 is falsy — might be wrong!)
const val2 = 0 ?? "default";    // 0 (null/undefined only — correct!)

const val3 = "" || "default";   // "default" (empty string is falsy)
const val4 = "" ?? "default";   // "" (not null/undefined — correct!)

// Combined pattern (React):
const displayName = user?.profile?.displayName ?? user?.name ?? "Guest";` },
    { title:"ES Modules — import and export",
      desc:"ES Modules are the official standard for JavaScript code organization. They're statically analyzed (tree-shakeable), support live bindings, and are async by default. Node.js added support via .mjs or type:module in package.json.",
      code:`// ─── NAMED EXPORTS (multiple per file) ───────────────
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { /* ... */ }

// Named imports
import { PI, add, Calculator } from "./math.js";
import { add as sum } from "./math.js"; // rename

// ─── DEFAULT EXPORT (one per file) ────────────────────
export default class UserService { /* ... */ }

// Default import (any name works)
import UserService from "./UserService.js";

// ─── BARREL FILES (index.js) ──────────────────────────
// components/index.js
export { default as Button } from "./Button.js";
export { default as Input } from "./Input.js";
// Now: import { Button, Input } from "./components";

// ─── DYNAMIC IMPORTS (code splitting) ─────────────────
const module = await import("./heavyModule.js");
// React lazy loading:
const Chart = React.lazy(() => import("./Chart"));

// ─── CommonJS (Node.js legacy) vs ESM ─────────────────
// CJS: const express = require("express"); module.exports = router;
// ESM: import express from "express"; export default router;` },
  ],
  comparison:{
    headers:["Feature","?? (nullish)","|| (logical OR)"],
    rows:[
      ["Triggers on null","Yes","Yes"],
      ["Triggers on undefined","Yes","Yes"],
      ["Triggers on 0","No ✅","Yes (bug risk)"],
      ["Triggers on ''","No ✅","Yes (bug risk)"],
      ["Triggers on false","No ✅","Yes (bug risk)"],
      ["Use when","null/undefined only valid sentinels","Any falsy value is invalid"],
    ]
  },
  mistakes:[
    { label:"Spread as deep clone",
      wrong:`const user = { name: "Alice", address: { city: "London" } };
const clone = { ...user };
clone.address.city = "Paris"; // ALSO changes user.address.city!`,
      right:`const clone = structuredClone(user); // ES2022 deep clone
// Or: JSON.parse(JSON.stringify(user)) for JSON-safe data`,
      why:"Spread performs a shallow clone — top-level properties are copied by value, but nested objects still share the same reference in memory." },
    { label:"Using || instead of ?? for defaults",
      wrong:`const limit = req.query.limit || 10;
// limit=0 in URL → becomes 10 (wrong!)`,
      right:`const limit = req.query.limit ?? 10;
// limit=0 → stays 0 ✅ (only null/undefined triggers default)`,
      why:"|| treats all falsy values (0, '', false) as 'use default'. ?? only treats null and undefined as 'use default', preserving valid falsy values." },
    { label:"Destructuring null without fallback",
      wrong:`const { name } = null; // TypeError!
const { name } = apiResponse?.data; // if data is null → TypeError`,
      right:`const { name } = apiResponse?.data ?? {};
const { name } = user || {};`,
      why:"Destructuring null or undefined throws TypeError. Always provide a fallback empty object when the source might be null/undefined." },
  ],
  interview:[
    { level:"beginner", q:"What is the difference between spread and rest?",
      a:"Same syntax (...), opposite purposes. Spread EXPANDS an iterable into individual elements — used in array/object literals and function calls. Rest COLLECTS multiple items into an array — used in function parameters and destructuring. const [a, ...rest] = arr — rest here collects remaining elements." },
    { level:"intermediate", q:"What is the difference between ?? and ||?",
      a:"|| triggers on any falsy value (0, '', false, null, undefined). ?? only triggers on null and undefined. Use ?? when 0, empty string, or false are valid values that should NOT be replaced by the default." },
    { level:"advanced", q:"Why can't spread be used for deep cloning?",
      a:"Spread creates a SHALLOW clone. Top-level primitive properties are copied by value (independent). But top-level object properties are copied by reference — the clone and original share the same nested object. Modifying nested objects in the clone modifies the original. Use structuredClone() for deep cloning." },
    { level:"advanced", q:"What are barrel files and what problem do they solve?",
      a:"A barrel file is an index.js that re-exports everything from a directory. Instead of import Button from './components/Button/Button.js'; import Input from './components/Input/Input.js', you import { Button, Input } from './components'. It simplifies import paths and creates a clean public API for a module directory." },
    { level:"faang", q:"Implement optional chaining (?.) as a utility function.",
      a:`function get(obj, path) {
  return path.split('.').reduce((current, key) =>
    current == null ? undefined : current[key], obj);
}
get(user, 'address.city'); // "London" or undefined safely` },
  ],
  cheatsheet:[
    "Destructuring: const { a, b = 'default' } = obj | const [x, ...rest] = arr",
    "Spread: expands iterables | Rest: collects into array (same ... syntax)",
    "?? vs ||: ?? only null/undefined; || any falsy (0, '' trigger ||)",
    "Optional chaining: obj?.prop?.method?.() — undefined on missing, no TypeError",
    "Spread is SHALLOW — use structuredClone() for deep copies",
    "Template literals: backtick + ${expression} — multiline and expression support",
    "Default params: fn(x = 10) — only for undefined, NOT null",
    "ESM: import/export | CJS: require/module.exports | Prefer ESM",
  ]
},
{
  id:7, icon:"ti-clock-play", color:"pink", title:"Promises & Event Loop", subtitle:"Async JavaScript & async/await",
  overview:{
    definition:"The Event Loop is JavaScript's mechanism for async operations in a single-threaded environment. It processes: synchronous code first, then drains all microtasks (Promise .then), then processes one macrotask (setTimeout/I/O), then repeats. A Promise represents a future value in one of three states: pending, fulfilled, or rejected. async/await is syntactic sugar over Promises.",
    why:"JavaScript runs in a single thread but web apps need concurrent operations (fetch, timers, events). The Event Loop enables non-blocking async behavior — the engine delegates I/O to runtime APIs, continues executing, and processes results when ready.",
    react:"Data fetching in useEffect, Suspense boundaries, Server Actions in Next.js, React Query all use Promises. Stale closure bugs in async useEffect are critical to understand.",
    node:"Node.js is built entirely on the Event Loop. Every scalable I/O pattern (database queries, file reads, HTTP requests) relies on non-blocking async operations.",
    express:"Every route handler is async. Database operations are async. Error handling with async middleware requires understanding Promise rejection chains.",
    interview:"One of the most technically deep topics. FAANG tests: Event Loop ordering, microtask vs macrotask, Promise.all/race/allSettled, async/await under the hood."
  },
  mentalModel:{
    analogy:"JavaScript is a restaurant with ONE chef (single thread). When you order (start async operation), the chef delegates to kitchen staff (Web APIs/Node.js runtime). The chef continues taking orders (running code). When a dish is ready (async completes), a ticket goes to the counter (task queue). The chef picks up tickets when free (Event Loop).",
    visual:`EVENT LOOP CYCLE:
1. Run ALL synchronous code (empty the call stack)
2. Drain ALL microtasks (Promise.then, queueMicrotask)
   → If new microtasks created, drain those too
3. Run ONE macrotask (setTimeout, I/O callback)
4. Go to step 2

PRIORITY:
process.nextTick > Promise.then > setImmediate > setTimeout/setInterval`,
    misconceptions:[
      ["JS is multi-threaded for async","JS is single-threaded; async is handled by the RUNTIME (not JS)"],
      ["Promises run code in parallel","Promise callbacks are still sequential — they just run later"],
      ["async makes functions concurrent","async/await just pauses within that function; other code still runs"],
    ]
  },
  theory:[
    { title:"Event Loop — execution order",
      desc:"The most classic async interview question. Synchronous code runs first, then all microtasks (Promises), then one macrotask (setTimeout). Microtasks have higher priority than macrotasks.",
      code:`console.log("1");                                  // sync
setTimeout(() => console.log("2"), 0);            // macrotask
Promise.resolve().then(() => console.log("3"));   // microtask
console.log("4");                                  // sync

// OUTPUT: 1, 4, 3, 2
// WHY:
// Sync: "1", "4"  (call stack exhausted)
// Microtasks: "3" (Promise .then — highest priority)
// Macrotask: "2"  (setTimeout — after all microtasks)

// Advanced ordering:
async function foo() {
  console.log("A");           // sync (inside foo before first await)
  await Promise.resolve();
  console.log("B");           // microtask
}
console.log("C");
foo();
console.log("D");
// OUTPUT: C, A, D, B` },
    { title:"Promise states and chaining",
      desc:"A Promise is always in one of three states: pending → fulfilled (resolve called) → rejected (reject called). States are permanent — once settled, they never change. .then returns a NEW promise, enabling chaining.",
      code:`// Creating a Promise
const fetchUser = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (id > 0) resolve({ id, name: "Alice" });
    else reject(new Error("Invalid ID"));
  }, 1000);
});

// Consuming — chaining
fetchUser(1)
  .then(user => {
    console.log(user.name); // "Alice"
    return fetchPosts(user.id); // return another Promise — chain waits
  })
  .then(posts => console.log(posts.length))
  .catch(error => console.error(error.message)) // catches ANY rejection
  .finally(() => console.log("Done")); // always runs

// Error propagation — errors skip .then and go to next .catch
Promise.reject(new Error("oops"))
  .then(v => console.log("skipped"))
  .then(v => console.log("skipped"))
  .catch(e => console.log("caught:", e.message)); // "caught: oops"` },
    { title:"Promise.all, allSettled, race, any",
      desc:"Four static methods for coordinating multiple Promises. Choose based on whether you need all to succeed, can tolerate failures, want the fastest, or want the first success.",
      code:`// Promise.all — parallel, fail-fast
const [user, posts] = await Promise.all([
  fetch("/api/user").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
// If ANY rejects → entire Promise.all rejects immediately

// Promise.allSettled — wait for all, get status
const results = await Promise.allSettled([
  fetch("/api/user"),
  fetch("/api/might-fail")
]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log("OK:", r.value);
  else console.log("Failed:", r.reason);
});

// Promise.race — first to settle (resolve OR reject)
const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
]);

// Promise.any — first to SUCCEED (ignores rejections)
const fastest = await Promise.any([
  fetch("https://server1.com"),
  fetch("https://server2.com"),
  fetch("https://server3.com")
]);` },
    { title:"async/await patterns and error handling",
      desc:"async/await makes Promise-based code readable. async functions always return a Promise. await pauses the async function (not the whole program) until the Promise settles.",
      code:`// Basic async/await
async function loadUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return await response.json();
  } catch (error) {
    console.error("Failed:", error.message);
    throw error; // re-throw for caller to handle
  } finally {
    console.log("Fetch complete"); // always runs
  }
}

// COMMON MISTAKE: sequential when parallel is possible
// ❌ SLOW (3 seconds total):
const a = await delay(1000);
const b = await delay(1000);
const c = await delay(1000);

// ✅ FAST (1 second total):
const [a, b, c] = await Promise.all([delay(1000), delay(1000), delay(1000)]);

// COMMON MISTAKE: await inside forEach (doesn't work!)
// ❌ WRONG:
items.forEach(async item => { await process(item); }); // forEach ignores Promise

// ✅ CORRECT:
for (const item of items) { await process(item); } // sequential
await Promise.all(items.map(item => process(item))); // parallel` },
  ],
  comparison:{
    headers:["Method","Behavior","Use case"],
    rows:[
      ["Promise.all","ALL must succeed; fails fast","Parallel independent requests"],
      ["Promise.allSettled","Wait for ALL; reports each status","Batch operations, partial success ok"],
      ["Promise.race","First to settle (resolve or reject)","Timeout wrapper, fastest server"],
      ["Promise.any","First to SUCCEED; all must fail to reject","Fallback servers, redundancy"],
    ]
  },
  mistakes:[
    { label:"await inside forEach",
      wrong:`const results = [];
items.forEach(async item => {
  results.push(await process(item)); // forEach ignores Promise
});
// results is still [] here!`,
      right:`// Sequential:
for (const item of items) { results.push(await process(item)); }
// Parallel:
const results = await Promise.all(items.map(process));`,
      why:"forEach doesn't await the async callback and ignores the returned Promise. Use for...of for sequential, Promise.all + map for parallel." },
    { label:"Not handling Promise rejections",
      wrong:`async function bad() {
  const data = await fetch("/api");
  return data.json(); // If this rejects, caller gets unhandled rejection
}
bad(); // No .catch() — unhandled!`,
      right:`bad().catch(console.error); // ✅ Handle at call site
// Or: try/catch inside the async function`,
      why:"Unhandled Promise rejections crash Node.js processes and log warnings. Always handle rejections either inside the async function or at the call site." },
    { label:"Sequential awaits when parallel is safe",
      wrong:`const user = await getUser(id);   // 1s
const posts = await getPosts(id);  // 1s (waits needlessly)
// Total: 2 seconds`,
      right:`const [user, posts] = await Promise.all([
  getUser(id), getPosts(id)
]); // Total: 1 second ✅`,
      why:"If async operations are independent (one doesn't need the result of another), run them in parallel with Promise.all. Sequential awaits waste time." },
  ],
  interview:[
    { level:"beginner", q:"What is the Event Loop?",
      a:"The Event Loop is JavaScript's mechanism for executing asynchronous operations in a single-threaded environment. It continuously checks if the call stack is empty, then processes callbacks from queues. Microtasks (Promise .then) have higher priority than macrotasks (setTimeout, I/O) — all pending microtasks are processed before the next macrotask." },
    { level:"intermediate", q:"What is the output? console.log('1'); setTimeout(()=>console.log('2'),0); Promise.resolve().then(()=>console.log('3')); console.log('4');",
      a:"Output: 1, 4, 3, 2. Explanation: Synchronous code runs first (1, 4). Then the Event Loop processes the microtask queue — Promise.then (3). Then it processes the macrotask queue — setTimeout (2). Microtasks always run before macrotasks." },
    { level:"advanced", q:"What is the difference between Promise.all and Promise.allSettled?",
      a:"Promise.all fails fast — if any promise rejects, the entire result rejects immediately and other promises are ignored. Promise.allSettled waits for every promise to settle and returns an array of {status: 'fulfilled'|'rejected', value/reason} objects. Use allSettled when partial success is acceptable." },
    { level:"advanced", q:"Why shouldn't you use await inside forEach?",
      a:"forEach doesn't await the async callback and ignores the returned Promise. The loop continues immediately without waiting. The forEach itself returns undefined, not a Promise that can be awaited. Use for...of for sequential async iteration, or Promise.all(array.map(asyncFn)) for parallel." },
    { level:"faang", q:"Implement Promise.all from scratch.",
      a:`function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (!promises.length) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}` },
  ],
  cheatsheet:[
    "Event Loop: Sync → ALL Microtasks → ONE Macrotask → repeat",
    "Microtasks: Promise.then, queueMicrotask (HIGH priority)",
    "Macrotasks: setTimeout, setInterval, I/O (LOW priority)",
    "Promise states: pending → fulfilled | rejected (permanent, one-way)",
    "Promise.all = fail-fast | allSettled = wait all | race = first | any = first success",
    "async function ALWAYS returns a Promise",
    "await pauses the async fn only — other code continues",
    "await in forEach = bug; use for...of or Promise.all + map",
  ]
},
{
  id:8, icon:"ti-cpu", color:"gray", title:"Memory Management", subtitle:"Garbage Collection & Leaks",
  overview:{
    definition:"JavaScript automatically manages memory through Garbage Collection (GC). The engine allocates memory when values are created and reclaims it when values are no longer reachable. V8 uses Mark-and-Sweep with a generational strategy (young/old generation). Memory leaks occur when the program accidentally holds references to objects that should be freed.",
    why:"Manual memory management (like C) is error-prone. JavaScript abstracts it away. But poor patterns (event listeners, closures, global caches) can prevent GC, causing leaks that crash long-running apps.",
    react:"Forgetting cleanup in useEffect causes memory leaks. Stale closures hold references. Infinite state growth crashes apps. React Strict Mode deliberately double-invokes effects to expose missing cleanup.",
    node:"Long-running servers must manage memory carefully. Node.js process.memoryUsage() monitors heap. Event listener accumulation is the most common Node.js leak.",
    express:"Middleware-level caches need size limits. Large request body buffering. Connection pool management.",
    interview:"Asked at senior/FAANG level. Tests production experience, understanding of GC, and ability to identify and fix real memory leaks."
  },
  mentalModel:{
    analogy:"Memory is a whiteboard. When you create a variable, you write on it. As long as someone can see what's written (a reference exists), it stays. When nobody needs it (no references), a cleaner (GC) erases it. Memory leaks happen when you forget to say 'I'm done' — the cleaner can't erase it, the whiteboard fills up, the app crashes.",
    visual:`REACHABILITY — what GC considers "alive":
  ROOTS (always alive):
    Global variables, current call stack, closures
           │
           ▼ (anything reachable from roots = alive)
  ALIVE: obj1 → obj2 → obj3
  UNREACHABLE: obj4 (no path from any root) → GC collects it

GENERATIONAL GC:
  New Object → [Young Generation] → survives 2+ GC → [Old Generation]
  Young GC: fast, frequent  |  Old GC: slow, infrequent`,
    misconceptions:[
      ["GC runs continuously","GC runs in scheduled pauses — not instant or continuous"],
      ["null = immediate memory free","null makes object ELIGIBLE for GC; actual freeing happens later"],
      ["Only globals cause leaks","Event listeners, timers, closures cause MOST leaks"],
    ]
  },
  theory:[
    { title:"Mark-and-Sweep — how GC works",
      desc:"V8's primary GC algorithm. Phase 1: starting from all roots, mark every reachable object. Phase 2: sweep through heap memory and free everything NOT marked.",
      code:`// When does an object become garbage?
let user = { name: "Alice", data: new Array(100000) };
// user holds a reference → NOT garbage

user = null;
// user no longer references the object → NOW eligible for GC
// The large array will also be collected (no other refs)

// Circular references are handled fine:
const a = {}, b = {};
a.ref = b;
b.ref = a; // Circular!
// Both set to null → both unreachable → GC handles it ✅

// V8 Generational GC:
// Young Gen (Nursery) — most objects die young (short-lived local vars)
// Old Gen — objects that survive multiple GC cycles
// Minor GC: fast, only scans Young Gen (runs every few ms)
// Major GC: slower, scans entire heap (runs when Old Gen fills)` },
    { title:"The 7 most common memory leaks",
      desc:"These patterns prevent GC by accidentally holding references to objects that should be freed.",
      code:`// LEAK 1: Forgotten event listeners
button.addEventListener("click", handler); // adds listener
// Component removed but listener still holds 'handler' in memory!
// FIX: removeEventListener("click", handler) in cleanup

// LEAK 2: Forgotten timers
const timer = setInterval(() => updateUI(), 1000);
// FIX: clearInterval(timer) when no longer needed

// LEAK 3: Closures holding large objects
function process(largeArray) {
  const result = compute(largeArray);
  return () => result; // largeArray ALSO kept alive in closure scope!
  // FIX: largeArray = null; // before the return
}

// LEAK 4: Detached DOM nodes
const removed = document.getElementById("div");
document.body.removeChild(removed); // removed from DOM
savedRefs.push(removed); // but still in JS — entire subtree in memory!

// LEAK 5: Global variables
function bad() { secret = "leak"; } // No declaration — goes on window!

// LEAK 6: Uncleared subscriptions (React)
useEffect(() => {
  const sub = store.subscribe(updateState); // subscribes
  // Missing return () => sub.unsubscribe(); → LEAK
}, []);

// LEAK 7: Unbounded caches
const cache = {}; // grows forever as keys are added!
// FIX: Use LRU cache with size limit` },
    { title:"WeakMap, WeakSet, WeakRef — memory-safe references",
      desc:"Weak references allow GC to collect objects even when they're referenced in a WeakMap/WeakSet/WeakRef. They don't prevent garbage collection.",
      code:`// Regular Map — STRONG reference (prevents GC)
const map = new Map();
let user = { name: "Alice" };
map.set(user, "metadata");
user = null;
// Object CANNOT be GC'd — map still holds it!

// WeakMap — WEAK reference (allows GC)
const weakMap = new WeakMap();
let user2 = { name: "Bob" };
weakMap.set(user2, "metadata");
user2 = null;
// Object CAN be GC'd — WeakMap entry auto-removed!

// Use cases:
// 1. DOM metadata (won't prevent element GC)
const elemData = new WeakMap();
const btn = document.getElementById("btn");
elemData.set(btn, { clicks: 0 });

// 2. Truly private class fields (before # syntax)
const _private = new WeakMap();
class Circle {
  constructor(r) { _private.set(this, { radius: r }); }
  area() { return Math.PI * _private.get(this).radius ** 2; }
}

// 3. Caches that don't prevent GC
const cache = new WeakMap(); // entry removed when key is GC'd` },
    { title:"React useEffect cleanup — preventing all leaks",
      desc:"The cleanup function returned from useEffect prevents the most common React memory leaks. It runs before the effect re-runs and when the component unmounts.",
      code:`function LiveChat({ roomId }) {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();   // for fetch cleanup
    let mounted = true;                   // prevent setState after unmount
    const ws = new WebSocket(\`wss://api.example.com/\${roomId}\`);
    const handler = (event) => {
      if (mounted) setMsgs(prev => [...prev, JSON.parse(event.data)]);
    };
    ws.addEventListener("message", handler);

    fetch(\`/api/rooms/\${roomId}/history\`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(history => { if (mounted) setMsgs(history); })
      .catch(e => { if (e.name !== "AbortError") console.error(e); });

    const timer = setInterval(() => sendHeartbeat(roomId), 30000);

    // ─── CLEANUP — prevents ALL memory leaks ──────────────
    return () => {
      mounted = false;                        // prevent stale setState
      ctrl.abort();                           // cancel in-flight fetch
      ws.removeEventListener("message", handler); // remove WS listener
      ws.close();                             // close WebSocket connection
      clearInterval(timer);                   // stop heartbeat
    };
    // ────────────────────────────────────────────────────────
  }, [roomId]);
}` },
  ],
  comparison:{
    headers:["Feature","Map","WeakMap","WeakRef"],
    rows:[
      ["Key type","Any","Objects only","N/A (holds ref)"],
      ["Prevents GC of keys?","Yes (strong)","No (weak)","No (weak)"],
      ["Iterable?","Yes","No","N/A"],
      [".size property?","Yes","No","N/A"],
      ["Use case","General data","DOM metadata, caches","Optional caching with deref()"],
    ]
  },
  mistakes:[
    { label:"Missing useEffect cleanup",
      wrong:`useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  // No return! Timer runs forever after unmount.
}, []);`,
      right:`useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(timer); // ✅ cleanup
}, []);`,
      why:"Without cleanup, the interval keeps running after component unmounts, calling setState on an unmounted component. Always return a cleanup function." },
    { label:"Unbounded global cache",
      wrong:`const cache = {}; // grows forever!
app.get("/api/data/:id", (req, res) => {
  if (!cache[req.params.id]) {
    cache[req.params.id] = fetchData(req.params.id);
  }
  res.json(await cache[req.params.id]);
});`,
      right:`class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(k) { /* move to end */ }
  set(k, v) { /* evict oldest if at capacity */ }
}
const cache = new LRUCache(1000); // bounded!`,
      why:"A plain object cache grows indefinitely. In a long-running Node.js server, this causes memory to grow until the process crashes. Use an LRU cache with a size limit." },
    { label:"Holding references to removed DOM elements",
      wrong:`const refs = [];
function removeElement(id) {
  const el = document.getElementById(id);
  el.remove();          // removed from DOM
  refs.push(el);        // still in JS memory!
}`,
      right:`function removeElement(id) {
  const el = document.getElementById(id);
  el.remove();
  // Don't store el anywhere — no refs = eligible for GC
}`,
      why:"DOM nodes removed from the document but still referenced in JavaScript stay in memory along with their entire subtree. Don't store references to elements you've removed." },
  ],
  interview:[
    { level:"intermediate", q:"What is a memory leak in JavaScript?",
      a:"A memory leak is when heap memory that should be freed cannot be garbage collected because the program holds an accidental reference to it. Common causes: forgotten event listeners, uncleaned timers, closures holding large objects, detached DOM nodes still referenced in JS, and unbounded global caches." },
    { level:"intermediate", q:"How does JavaScript's garbage collector decide what to free?",
      a:"V8 uses Mark-and-Sweep. Starting from all roots (global variables, stack variables, closure references), it marks every reachable object. Then it sweeps the heap and frees everything NOT marked. An object is collected when no path exists from any root to that object." },
    { level:"advanced", q:"What is the difference between Map and WeakMap for memory management?",
      a:"Map holds STRONG references — objects used as keys cannot be GC'd as long as the Map exists. WeakMap holds WEAK references — if a key object has no other references, it can be garbage collected and the WeakMap entry is automatically removed. Use WeakMap for caches and DOM metadata that shouldn't prevent GC." },
    { level:"advanced", q:"Why does React's useEffect need a cleanup function?",
      a:"The cleanup function prevents memory leaks by cleaning up side effects before the component unmounts or before the effect re-runs. Without cleanup: event listeners accumulate across re-renders, timers keep running after unmount, WebSocket connections stay open, and fetch requests try to update unmounted component state." },
    { level:"faang", q:"Implement an LRU Cache with O(1) get and put.",
      a:`class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);   // remove from current position
    this.cache.set(key, val); // re-insert at end (most recent)
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value); // evict oldest
    this.cache.set(key, value);
  }
}` },
  ],
  cheatsheet:[
    "GC = Mark reachable objects → Sweep (free) unreachable ones",
    "Generational: Young Gen (fast/frequent) + Old Gen (slow/infrequent)",
    "Object is eligible for GC when no reference path from any root exists",
    "Top 7 leaks: event listeners, timers, closures, detached DOM, globals, subscriptions, unbounded caches",
    "WeakMap/WeakSet: weak references — don't prevent GC of keys",
    "Always return cleanup from useEffect in React",
    "LRU Cache: bounded size, evict least-recently-used (Map preserves order)",
    "process.memoryUsage().heapUsed — monitor in Node.js production",
  ]
},
];

const SECTIONS = ["overview","mental model","theory","examples","mistakes","interview","cheat sheet"];

const Section = ({ topic, section }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const color = COLORS[topic.color];
  const bg = BG_COLORS[topic.color];

  if (section === "overview") return (
    <div>
      <p style={{fontSize:15,lineHeight:1.8,color:"var(--color-text-secondary)",margin:"0 0 20px"}}>{topic.overview.definition}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(0,1fr))",gap:10,margin:"0 0 20px"}}>
        {[["React",topic.overview.react],["Node.js",topic.overview.node],["Express",topic.overview.express]].map(([label,text])=>(
          <div key={label} style={{padding:"12px 14px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)"}}>
            <div style={{fontSize:11,fontWeight:500,color,marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.6}}>{text}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"14px 16px",background:bg,borderRadius:"var(--border-radius-md)",border:`0.5px solid ${color}22`}}>
        <div style={{fontSize:11,fontWeight:500,color,marginBottom:6}}>WHY INTERVIEWERS ASK THIS</div>
        <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.6}}>{topic.overview.interview}</p>
      </div>
    </div>
  );

  if (section === "mental model") return (
    <div>
      <div style={{padding:"16px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",marginBottom:14,border:"0.5px solid var(--color-border-tertiary)"}}>
        <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:8}}>ANALOGY</div>
        <p style={{margin:0,fontSize:14,lineHeight:1.75,color:"var(--color-text-primary)"}}>{topic.mentalModel.analogy}</p>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:8}}>VISUAL MODEL</div>
        <pre style={{margin:0,padding:"14px 16px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",fontSize:12,lineHeight:1.7,fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",overflowX:"auto",border:"0.5px solid var(--color-border-tertiary)"}}>{topic.mentalModel.visual}</pre>
      </div>
      <div>
        <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:8}}>COMMON MISCONCEPTIONS</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {topic.mentalModel.misconceptions.map(([wrong,right],i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderRadius:"var(--border-radius-md)",overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
              <div style={{padding:"10px 12px",background:"var(--color-background-danger)"}}>
                <div style={{fontSize:10,fontWeight:500,color:"var(--color-text-danger)",marginBottom:4}}>MISCONCEPTION</div>
                <div style={{fontSize:13,color:"var(--color-text-danger)"}}>{wrong}</div>
              </div>
              <div style={{padding:"10px 12px",background:"var(--color-background-success)"}}>
                <div style={{fontSize:10,fontWeight:500,color:"var(--color-text-success)",marginBottom:4}}>REALITY</div>
                <div style={{fontSize:13,color:"var(--color-text-success)"}}>{right}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "theory") return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {topic.theory.map((item,i)=>(
        <div key={i}>
          <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",marginBottom:6}}>{item.title}</div>
          <p style={{margin:"0 0 10px",fontSize:13.5,color:"var(--color-text-secondary)",lineHeight:1.7}}>{item.desc}</p>
          <Code code={item.code} />
        </div>
      ))}
    </div>
  );

  if (section === "examples") return (
    <div>
      {topic.comparison && (
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:10}}>COMPARISON TABLE</div>
          <Cmp headers={topic.comparison.headers} rows={topic.comparison.rows} />
        </div>
      )}
    </div>
  );

  if (section === "mistakes") return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {topic.mistakes.map((m,i)=>(
        <div key={i} style={{borderRadius:"var(--border-radius-lg)",overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{padding:"10px 14px",background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <i className="ti ti-alert-triangle" style={{fontSize:15,color:"var(--color-text-warning)"}} aria-hidden="true"/>
              <span style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{m.label}</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
            <div style={{padding:14,borderRight:"0.5px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-danger)",marginBottom:8}}>WRONG</div>
              <pre style={{margin:0,fontSize:12,fontFamily:"var(--font-mono)",color:"var(--color-text-danger)",lineHeight:1.65,whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:highlight(m.wrong)}}/>
            </div>
            <div style={{padding:14}}>
              <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-success)",marginBottom:8}}>CORRECT</div>
              <pre style={{margin:0,fontSize:12,fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",lineHeight:1.65,whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:highlight(m.right)}}/>
            </div>
          </div>
          <div style={{padding:"10px 14px",borderTop:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
            <span style={{fontSize:12,color:"var(--color-text-secondary)"}}><strong style={{fontWeight:500}}>Why: </strong>{m.why}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (section === "interview") return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {topic.interview.map((q,i)=>(
        <div key={i} style={{borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",overflow:"hidden"}}>
          <button onClick={()=>setOpenIdx(openIdx===i?null:i)} style={{width:"100%",padding:"12px 14px",background:"var(--color-background-secondary)",border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              <div style={{marginBottom:6}}><Badge level={q.level}/></div>
              <div style={{fontSize:14,color:"var(--color-text-primary)",lineHeight:1.5,fontWeight:500}}>{q.q}</div>
            </div>
            <i className={`ti ti-chevron-${openIdx===i?"up":"down"}`} style={{fontSize:16,color:"var(--color-text-tertiary)",flexShrink:0,marginTop:2}} aria-hidden="true"/>
          </button>
          {openIdx===i && (
            <div style={{padding:"14px",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
              {q.a.includes('\n') || q.a.includes('{')
                ? <Code code={q.a}/>
                : <p style={{margin:0,fontSize:13.5,color:"var(--color-text-secondary)",lineHeight:1.75}}>{q.a}</p>
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (section === "cheat sheet") return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10}}>
        {topic.cheatsheet.map((item,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"12px 14px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",border:`0.5px solid var(--color-border-tertiary)`,alignItems:"flex-start"}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <span style={{fontSize:11,fontWeight:500,color}}>{i+1}</span>
            </div>
            <span style={{fontSize:13.5,color:"var(--color-text-primary)",lineHeight:1.6,fontFamily:"var(--font-mono)"}}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
};

export default function App() {
  const [activeTopic, setActiveTopic] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [search, setSearch] = useState("");
  const topic = TOPICS[activeTopic];

  const filtered = useMemo(()=>
    search.trim().length > 1
      ? TOPICS.filter(t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.subtitle.toLowerCase().includes(search.toLowerCase())
        )
      : TOPICS,
    [search]
  );

  const color = COLORS[topic.color];
  const bg = BG_COLORS[topic.color];

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"var(--font-sans)",background:"var(--color-background-tertiary)",overflow:"hidden"}}>
      <h2 className="sr-only">JavaScript complete study notes — interactive handbook covering 8 core topics</h2>

      <div style={{width:260,flexShrink:0,display:"flex",flexDirection:"column",borderRight:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",overflowY:"auto"}}>
        <div style={{padding:"16px 14px 12px",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>JS Handbook</div>
          <div style={{position:"relative"}}>
            <i className="ti ti-search" style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--color-text-tertiary)"}} aria-hidden="true"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:"100%",paddingLeft:30,fontSize:13,boxSizing:"border-box"}}/>
          </div>
        </div>
        <div style={{padding:"8px 8px",flex:1}}>
          {(search.trim().length > 1 ? filtered : TOPICS).map((t)=>{
            const isActive = t.id === topic.id;
            const tc = COLORS[t.color];
            const tb = BG_COLORS[t.color];
            return (
              <button key={t.id} onClick={()=>{setActiveTopic(TOPICS.indexOf(t));setActiveSection(0);setSearch("");}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:"var(--border-radius-md)",marginBottom:2,border:"none",cursor:"pointer",background:isActive?tb:"transparent",textAlign:"left"}}>
                <div style={{width:28,height:28,borderRadius:"var(--border-radius-md)",background:isActive?tc+"22":"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className={`ti ${t.icon}`} style={{fontSize:14,color:isActive?tc:"var(--color-text-tertiary)"}} aria-hidden="true"/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:isActive?500:400,color:isActive?"var(--color-text-primary)":"var(--color-text-secondary)",lineHeight:1.2}}>{t.title}</div>
                  <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:2}}>{t.subtitle}</div>
                </div>
                {isActive && <div style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:tc,flexShrink:0}}/>}
              </button>
            );
          })}
        </div>
        <div style={{padding:"10px 14px",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>8 topics · 23 sections each</div>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 20px",background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:"var(--border-radius-md)",background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className={`ti ${topic.icon}`} style={{fontSize:18,color}} aria-hidden="true"/>
            </div>
            <div>
              <div style={{fontSize:17,fontWeight:500,color:"var(--color-text-primary)"}}>{topic.title}</div>
              <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>{topic.subtitle}</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:8}}>
              <button onClick={()=>setActiveTopic(Math.max(0,activeTopic-1))} style={{padding:"5px 10px",fontSize:12}} disabled={activeTopic===0}>
                <i className="ti ti-arrow-left" aria-hidden="true"/> prev
              </button>
              <button onClick={()=>setActiveTopic(Math.min(TOPICS.length-1,activeTopic+1))} style={{padding:"5px 10px",fontSize:12}} disabled={activeTopic===TOPICS.length-1}>
                next <i className="ti ti-arrow-right" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {SECTIONS.map((s,i)=>(
              <button key={s} onClick={()=>setActiveSection(i)} style={{padding:"5px 12px",fontSize:12,borderRadius:20,border:activeSection===i?`0.5px solid ${color}`:"0.5px solid var(--color-border-tertiary)",background:activeSection===i?bg:"transparent",color:activeSection===i?color:"var(--color-text-secondary)",fontWeight:activeSection===i?500:400}}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          <Section topic={topic} section={SECTIONS[activeSection]}/>
          <div style={{height:40}}/>
        </div>

        <div style={{padding:"8px 20px",borderTop:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",display:"flex",gap:6,flexShrink:0}}>
          {TOPICS.map((t,i)=>(
            <button key={t.id} onClick={()=>{setActiveTopic(i);setActiveSection(0);}} title={t.title} style={{padding:0,width:28,height:28,borderRadius:"var(--border-radius-md)",border:"none",background:i===activeTopic?BG_COLORS[t.color]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <i className={`ti ${t.icon}`} style={{fontSize:14,color:i===activeTopic?COLORS[t.color]:"var(--color-text-tertiary)"}} aria-hidden="true"/>
            </button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>topic {activeTopic+1} of {TOPICS.length}</span>
            <div style={{display:"flex",gap:2}}>
              {TOPICS.map((_,i)=>(
                <div key={i} style={{width:i===activeTopic?16:6,height:4,borderRadius:4,background:i===activeTopic?color:"var(--color-border-secondary)",transition:"width .2s"}}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --c-kw: var(--color-text-info);
          --c-str: var(--color-text-success);
          --c-cmt: var(--color-text-tertiary);
          --c-num: var(--color-text-warning);
          --c-fn: var(--color-text-primary);
        }
        .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }
        button { font-family: var(--font-sans); }
      `}</style>
    </div>
  );
}
