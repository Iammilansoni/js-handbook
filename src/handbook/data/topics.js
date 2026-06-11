export const TOPICS = [
{
  id: 11, slug: "data-types-primitives", icon: "🧬", color: "teal", title: "Data Types & Primitives", subtitle: "Stack vs Heap, Value vs Reference",
  overview: {
    definition: "JavaScript has 8 data types: 7 primitives (string, number, bigint, boolean, undefined, null, symbol) and 1 structural type (object). Primitives are immutable values stored directly on the call stack. Objects are mutable heap-allocated structures — the stack only holds a reference pointer to their heap address.",
    why: "JavaScript was designed in 10 days as a loosely typed scripting language for the browser. Brendan Eich modeled primitives after Scheme's value semantics and objects after Self's prototype-based inheritance. The 'typeof null === object' quirk is a 30-year-old bug preserved for backward compatibility.",
    react: "React's reconciliation (diffing) depends entirely on value vs reference equality. Primitive state changes always trigger re-renders because a new value is created. Object/array state must be replaced with a new reference (spread or structuredClone).",
    node: "In Node.js, Buffer objects sit outside V8's heap in C++ allocated memory. Large binary data should use Buffers rather than JS strings to avoid excessive garbage collection pressure.",
    express: "Express middleware heavily uses the reference nature of the req object — each middleware mutates the same heap object and passes the pointer forward.",
    interview: "Interviewers use data types to probe whether a candidate truly understands JS's memory model or just its syntax."
  },
  mentalModel: {
    analogy: "The Stack is a whiteboard in the room — fast to read/write, but small. The Heap is a storage warehouse — unlimited space, but you need a slip of paper (reference/pointer) from the whiteboard to find anything in it.",
    visual: `
STACK (Call Frame)          HEAP (Memory Warehouse)
┌──────────────────┐        ┌──────────────────────────────┐
│ name = "Milan"   │        │ 0x01 → { name: "Milan",      │
│ age  = 23        │        │          skills: [...]  }    │
│ user = 0x01 ─────┼────────►                              │
│ copy = 0x01 ─────┼────────►  (SAME object!)              │
└──────────────────┘        └──────────────────────────────┘`,
    misconceptions: [
      ["null means 'no object' so typeof null === 'null'", "typeof null === 'object' — a 30-year-old V8 bug."],
      ["const makes an object immutable", "const only locks the binding (the stack pointer). The heap object it points to is fully mutable."],
      ["undefined and null are the same", "undefined is engine default, null is explicit assignment."],
      ["NaN === NaN", "NaN is the only value in JS not equal to itself. Use Number.isNaN(value)."]
    ]
  },
  theory: [
    {
      title: "The 7 Primitives",
      desc: "Primitives are immutable and compared by value.",
      code: `let str = "hello"; let num = 42; let big = 9007199254740991n; let bool = true; let undef; let empty = null; let sym = Symbol("id");`
    },
    {
      title: "Value vs Reference",
      desc: "Objects are heap-allocated. The variable holds a reference pointer.",
      code: `const user = { name: "Milan" }; const adminView = user; adminView.name = "X"; console.log(user.name); // "X"`
    },
    {
      title: "Checking Types Correctly",
      desc: "typeof works for primitives but is unreliable for objects. Use Array.isArray(), instanceof, and Object.prototype.toString.call().",
      code: `typeof null // "object"\nArray.isArray([]) // true\nObject.prototype.toString.call([]) // "[object Array]"`
    },
    {
      title: "Cloning Objects",
      desc: "Shallow clone vs Deep clone.",
      code: `const shallow = { ...original };\nconst deep = structuredClone(original);`
    }
  ],
  comparison: {
    headers: ["Type", "Category", "typeof", "Compared by"],
    rows: [
      ["string", "Primitive", '"string"', "Value"],
      ["number", "Primitive", '"number"', "Value"],
      ["boolean", "Primitive", '"boolean"', "Value"],
      ["undefined", "Primitive", '"undefined"', "Value"],
      ["null", "Primitive", '"object" ⚠️', "Value"],
      ["object / array", "Object", '"object"', "Reference"]
    ]
  },
  mistakes: [
    {
      label: "Mutating Shared Object State",
      wrong: `const defaults = { theme: "dark" }; const userPrefs = defaults; userPrefs.theme = "light";`,
      right: `const userPrefs = { ...defaults, theme: "light" };`,
      why: "Assignment copies the pointer, not the object."
    },
    {
      label: "Equality Trap with Objects",
      wrong: `[1, 2] === [1, 2] // false`,
      right: `JSON.stringify([1, 2]) === JSON.stringify([1, 2]) // true`,
      why: "=== compares memory addresses for objects."
    }
  ],
  challenge: {
    title: "Deep Type Inspector",
    description: "Implement getType(value) that returns 'null', 'array', 'date', 'regexp', 'nan', 'object', or typeof primitive.",
    initialCode: `function getType(value) { }`,
    testCases: [ { input: "[null]", expected: '"null"' }, { input: "[[1,2]]", expected: '"array"' } ]
  },
  interview: [
    { level: "beginner", q: "What's the difference between null and undefined?", a: "undefined is default engine value; null is explicit." },
    { level: "faang", q: "Explain how V8 stores primitives vs objects in memory.", a: "Primitives on stack, objects on heap. SMIs (small integers) are stored inline in the pointer itself as tagged values." }
  ],
  cheatsheet: [
    "7 primitives: string, number, bigint, boolean, undefined, null, symbol",
    "Objects live on the heap — variables hold a pointer.",
    "typeof null === 'object' is a bug.",
    "Use structuredClone() for deep copies."
  ]
},

{
  id: 9, slug: "type-coercion", icon: "🔀", color: "amber", title: "Type Coercion", subtitle: "== vs ===, ToPrimitive & Implicit Conversion",
  overview: {
    definition: "Type coercion is JS's automatic conversion of a value from one type to another. The abstract == operator triggers coercion following strict algorithms; === never does.",
    why: "JS was built to be forgiving to lower the barrier to entry (e.g. 1 + '2' = '12'). This flexibility creates notorious gotchas.",
    react: "The most common bug: `{count && <List />}` renders '0' when count is 0. Use `{count > 0}`.",
    node: "process.env values are ALWAYS strings. `process.env.DEBUG == true` always fails.",
    express: "req.params are always strings. `req.params.id + 1` gives '1231'.",
    interview: "Interviewers ask for the exact steps the engine takes for tricky expressions like `[] + {}`."
  },
  mentalModel: {
    analogy: "Type coercion is an overly helpful automatic translator. When you add a number and a string, it translates them so the conversation continues.",
    visual: `
THE 6 FALSY VALUES: false, 0, "", null, undefined, NaN
TRUTHY SURPRISES: "0", "false", [], {}, -1

ABSTRACT EQUALITY (==) KEY RULES:
  null == undefined → true
  null == 0         → false
  "5"  == 5         → true
  []   == false     → true
`,
    misconceptions: [
      ["null == false is true", "null ONLY equals null and undefined under ==."],
      ["NaN == NaN is true", "NaN is the only value not equal to itself."],
      ["{} == {} is true", "Objects are compared by reference. false."]
    ]
  },
  theory: [
    {
      title: "The Six Falsy Values",
      desc: "These are the only six values that convert to false.",
      code: `[false, 0, "", null, undefined, NaN].map(Boolean);`
    },
    {
      title: "ToPrimitive Algorithm",
      desc: "JS calls ToPrimitive: checks for [Symbol.toPrimitive], then valueOf(), then toString().",
      code: `const obj = { valueOf() { return 42; } };\nconsole.log(obj + 1); // 43`
    },
    {
      title: "Abstract Equality (==)",
      desc: "The == operator follows a specific priority order.",
      code: `null == undefined // true\n"42" == 42 // true\n[] == false // true`
    }
  ],
  comparison: {
    headers: ["Expression", "Result", "Why"],
    rows: [
      ["null == undefined", "true", "Special ECMAScript rule"],
      ["null == 0", "false", "null has no numeric coercion in =="],
      ["[] == false", "true", "[] → '' → 0; false → 0"],
      ["NaN == NaN", "false", "NaN is never equal to itself"],
      ["{} == {}", "false", "Objects compared by reference"]
    ]
  },
  mistakes: [
    {
      label: "React: the infamous '0' renders in JSX",
      wrong: `{messages.length && <List />}`,
      right: `{messages.length > 0 && <List />}`,
      why: "React renders falsy numbers (0, NaN) as text nodes."
    },
    {
      label: "parseInt without radix",
      wrong: `['1','2','3'].map(parseInt); // [1, NaN, NaN]`,
      right: `['1','2','3'].map(Number); // [1, 2, 3]`,
      why: "map passes index as the second argument to parseInt (radix)."
    }
  ],
  challenge: {
    title: "Type Coercion Detective",
    description: "Implement solve(a, b) that returns true if a == b but a !== b.",
    initialCode: `function solve(a, b) { return a == b && a !== b; }`,
    testCases: [ { input: "['1', 1]", expected: "true" }, { input: "[1, 1]", expected: "false" } ]
  },
  interview: [
    { level: "beginner", q: "== vs ===?", a: "=== compares value and type. == coerces types first." },
    { level: "intermediate", q: "What are the six falsy values?", a: "false, 0, '', null, undefined, NaN. '0' is truthy as a string." },
    { level: "advanced", q: "Why does [] + {} result in '[object Object]'?", a: "[] calls toString() to become ''. {} calls toString() to become '[object Object]'. Concat gives '[object Object]'." }
  ],
  cheatsheet: [
    "Only 6 falsy values: false, 0, '', null, undefined, NaN",
    "Objects (even empty ones like [] and {}) are ALWAYS truthy.",
    "null == undefined is true, but null == 0 is false.",
    "Always use === in production code.",
    "React trap: {0 && <Component/>} renders '0'."
  ]
},

{
  id:1, slug: "var-let-const", icon: "🪜", color:"amber", title:"var / let / const", subtitle:"Hoisting & Scope",
  overview:{
    definition:"Three ways to declare variables. var is function-scoped and hoisted with undefined. let is block-scoped and enters a Temporal Dead Zone. const is block-scoped, must be initialized, and its reference cannot be reassigned.",
    why:"JavaScript originally only had var, which caused bugs from function scope and hoisting quirks. let and const were added in ES6 to give block-level scoping and safer semantics.",
    react:"const for all component definitions, let for values that change inside hooks, understanding scope prevents stale closure bugs in useEffect.",
    node:"const for all require() imports, const for configuration, let for values that change across retry loops.",
    express:"const app = express(), const router = express.Router(), const PORT = process.env.PORT || 3000.",
      challenge: {
  "title": "Scope Detective",
  "description": "Fix the function so it returns an array of [0, 1, 2] instead of [3, 3, 3]. Use the correct variable declaration keyword.",
  "initialCode": "function solve() {\\n  const result = [];\\n  for (var i = 0; i < 3; i++) {\\n    result.push(() => i);\\n  }\\n  return result.map(fn => fn());\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "[0, 1, 2]"
    }
  ]
},
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
  challenge: {
  "title": "Scope Detective",
  "description": "Fix the function so it returns an array of [0, 1, 2] instead of [3, 3, 3]. Use the correct variable declaration keyword.",
  "initialCode": "function solve() {\\n  const result = [];\\n  for (var i = 0; i < 3; i++) {\\n    result.push(() => i);\\n  }\\n  return result.map(fn => fn());\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "[0, 1, 2]"
    }
  ]
},
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
  id: 12, slug: "arrays-methods", icon: "📦", color: "amber", title: "Arrays & Array Methods", subtitle: "Iteration, Transformation & Immutability",
  overview: {
    definition: "A JavaScript array is a dynamic, ordered, integer-indexed collection backed by a heap-allocated object. JS arrays are hash maps under the hood unless V8 can optimize them into 'fast arrays'.",
    why: "The functional API (map, filter, reduce) was inspired by Lisp/Haskell to let developers express data transformation as pipelines of pure functions.",
    react: "Array methods are the engine of React rendering. .map() renders lists. Mutating methods won't trigger re-renders.",
    node: "In Node.js streams, arrays accumulate chunks in memory.",
    express: "Express route handlers often transform arrays of database results before sending responses.",
    interview: "Arrays are the most tested data structure in technical interviews."
  },
  mentalModel: {
    analogy: "An array is an assembly line conveyor belt. .map() transforms, .filter() rejects, .reduce() packs everything into one box.",
    visual: `
MUTATING (changes original)    NON-MUTATING (returns new)
.push()    .pop()              .map()      .concat()
.shift()   .unshift()          .filter()   .slice()
.splice()  .sort() ⚠️          .reduce()   .flat()
.fill()    .reverse() ⚠️       .find()`,
    misconceptions: [
      [".sort() sorts numbers correctly by default", ".sort() converts elements to strings and sorts lexicographically by default."],
      [".forEach() returns a new array like .map()", ".forEach() always returns undefined."],
      [".reduce() is only for summing numbers", ".reduce() can produce ANY output shape."]
    ]
  },
  theory: [
    {
      title: "Core Iteration Methods",
      desc: "The four workhorses of array transformation.",
      code: `const nums = [1, 2, 3];
nums.map(n => n * 2); // [2, 4, 6]
nums.filter(n => n > 1); // [2, 3]
nums.reduce((acc, n) => acc + n, 0); // 6`
    },
    {
      title: "Immutable Update Patterns (React-safe)",
      desc: "In React, state arrays must never be mutated.",
      code: `const added = [...items, 6];
const removed = items.filter((_, i) => i !== 2);
const updated = items.map((x, i) => i === 2 ? 99 : x);`
    }
  ],
  comparison: {
    headers: ["Method", "Returns", "Mutates?", "Use Case"],
    rows: [
      [".map()", "New array", "No", "Transform every element"],
      [".filter()", "New array", "No", "Keep matching elements"],
      [".reduce()", "Single value", "No", "Aggregate/reshape"],
      [".sort()", "Same array", "YES ⚠️", "Sort (spread first in React)"]
    ]
  },
  mistakes: [
    {
      label: "Forgetting .sort() is Lexicographic by Default",
      wrong: `[100, 9, 21].sort(); // [100, 21, 9]`,
      right: `[100, 9, 21].sort((a, b) => a - b); // [9, 21, 100]`,
      why: "Sorts as strings by default."
    },
    {
      label: "Using .reduce() Without an Initial Value",
      wrong: `[].reduce((a, b) => a + b);`,
      right: `[].reduce((a, b) => a + b, 0);`,
      why: "Throws TypeError on empty array."
    }
  ],
  challenge: {
    title: "Group & Aggregate",
    description: "Implement groupAndSum.",
    initialCode: `function groupAndSum(orders, key) { }`,
    testCases: [ { input: "[[{type:'a',amount:10},{type:'a',amount:30}], 'type']", expected: '{"a":40}' } ]
  },
  interview: [
    { level: "intermediate", q: "How to remove duplicates?", a: "For primitives: [...new Set(array)]. For objects: reduce or filter." },
    { level: "faang", q: "What is a 'fast array' in V8?", a: "PACKED_SMI_ELEMENTS (dense small integers) vs DICTIONARY_ELEMENTS (sparse/mixed types hash map)." }
  ],
  cheatsheet: [
    "map transforms, filter selects, reduce aggregates.",
    "React state: never .push()/.splice().",
    ".sort() mutates in place — always pass a comparator.",
    "Array.from({length: 5}, (_, i) => i) creates a range."
  ]
},

{
  id: 13, slug: "objects-methods", icon: "🗂️", color: "purple", title: "Objects & Object Methods", subtitle: "Manipulation, Iteration & Immutability",
  overview: {
    definition: "A JavaScript object is a dynamic collection of key-value pairs where keys are strings (or Symbols). V8 represents objects using 'Hidden Classes' to generate optimized machine code.",
    why: "Modeled after the Self programming language. Everything in JS is either a primitive or an object.",
    react: "Objects are everywhere in React. The critical pattern is immutable update using the spread operator.",
    node: "In Node.js, process.env is a flat string-to-string object.",
    express: "Express uses the req object as a central mutable state bag for a request lifecycle.",
    interview: "Can you transform an object without mutation? Can you implement a deep merge?"
  },
  mentalModel: {
    analogy: "An object is a filing cabinet with labeled folders. When you 'copy' the cabinet with spread (...obj), you're xeroxing the folder labels and top-level docs, but nested objects are just given the same map reference.",
    visual: `
Shallow spread: { ...user } copies top-level slots.
Nested objects still point to the same memory reference.`,
    misconceptions: [
      ["Object.keys() returns all properties", "It only returns OWN ENUMERABLE string-keyed properties."],
      ["Object.freeze() deeply freezes an object", "It is SHALLOW. Nested objects remain mutable."]
    ]
  },
  theory: [
    {
      title: "Creating and Accessing",
      desc: "Objects can be created via literals. Keys can be dynamic.",
      code: `const user = { name: "Milan", [\`score_\${id}\`]: 100 };\nuser?.address?.city; // optional chaining`
    },
    {
      title: "Destructuring & Spread",
      desc: "Extracts values into variables and merges properties.",
      code: `const { name, role = "guest", ...rest } = user;\nconst updated = { ...user, age: 24 };`
    },
    {
      title: "Object Static Methods",
      desc: "Safe, modern replacement for for...in loops.",
      code: `Object.keys(obj); // ["name", "age"]\nObject.values(obj); // ["Milan", 24]\nObject.entries(obj); // [["name", "Milan"], ["age", 24]]`
    },
    {
      title: "Property Descriptors & Object.defineProperty",
      desc: "Every object property has a hidden descriptor controlling its behavior: value, writable, enumerable, and configurable.",
      code: `Object.defineProperty(obj, 'secret', {\n  value: 42,\n  writable: false,\n  enumerable: false,\n  configurable: false\n});`
    }
  ],
  comparison: {
    headers: ["Method", "Target", "Effect"],
    rows: [
      ["Object.keys()", "Object", "Returns own enumerable string keys"],
      ["Object.values()", "Object", "Returns own enumerable values"],
      ["Object.entries()", "Object", "Returns own enumerable [key, value] pairs"],
      ["Object.freeze()", "Object", "Prevents adding/removing/modifying (shallow)"]
    ]
  },
  mistakes: [
    {
      label: "Iterating with for...in",
      wrong: `for (const key in obj) { } // ❌ Iterates prototype chain too!`,
      right: `Object.keys(obj).forEach(key => { }); // ✅ Own properties only`,
      why: "for...in traverses the entire prototype chain."
    },
    {
      label: "Mutating React State Objects",
      wrong: `user.age = 24; setUser(user);`,
      right: `setUser(prev => ({ ...prev, age: 24 }));`,
      why: "React uses Object.is() for state comparisons."
    }
  ],
  challenge: {
    title: "Deep Merge Objects",
    description: "Implement a deepMerge function.",
    initialCode: `function deepMerge(target, source) { }`,
    testCases: [ { input: "[{a: 1, b: {c: 2}}, {b: {d: 3}, e: 4}]", expected: '{"a":1,"b":{"c":2,"d":3},"e":4}' } ]
  },
  interview: [
    { level: "intermediate", q: "Is Object.freeze() deep?", a: "No, it is strictly shallow. Nested objects can still be modified." },
    { level: "faang", q: "Explain V8's Hidden Classes.", a: "V8 creates 'Hidden Classes' to optimize property access. Adding properties in the same order shares Hidden Classes; deleting or random order degrades performance." }
  ],
  cheatsheet: [
    "Object.keys(), Object.values(), Object.entries() are safe iteration tools.",
    "Spread (...obj) performs a SHALLOW copy.",
    "Never mutate state objects in React; always return a new object.",
    "for...in is risky due to prototype chain traversal."
  ]
},

{
  id: 14, slug: "error-handling", icon: "🚨", color: "red", title: "Error Handling", subtitle: "try/catch/finally, Custom Errors & Async Pitfalls",
  overview: {
    definition: "JavaScript error handling is built around the Error object and the try/catch/finally control flow construct. When a throw statement executes, JavaScript unwinds the call stack frame by frame, looking for the nearest enclosing catch block.",
    why: "Early JavaScript had no structured error handling — scripts just crashed silently. try/catch was introduced in ES3 (1999) modeled after Java's exception system.",
    react: "React introduced Error Boundaries (class components with componentDidCatch) to catch rendering errors and show fallback UI instead of crashing the whole tree.",
    node: "Node.js has two critical global error events: process.on('uncaughtException') and process.on('unhandledRejection').",
    express: "Express requires a 4-argument error middleware (err, req, res, next) as the final middleware to catch synchronous errors forwarded via next(err).",
    interview: "Interviewers specifically probe: can you implement a retry-with-backoff? Do you know the difference between operational errors and programmer errors?"
  },
  mentalModel: {
    analogy: "Error handling is like a net under a trapeze act. try is the trapeze. catch is the safety net. finally is the stagehands cleaning up.",
    visual: `
// ✅ RIGHT
try {
  await asyncFn();   // await unwraps rejection
} catch(e) {}        // now catches it ✅`,
    misconceptions: [
      ["try/catch catches errors in async callbacks and Promises", "try/catch only catches synchronous throws and await-ed rejections."],
      ["finally runs after the return in try", "finally ALWAYS runs — even if there's a return in try or catch."],
      ["catch (err) catches any type of thrown value", "You can throw any JS value, but only Error instances have a .stack property."]
    ]
  },
  theory: [
    {
      title: "The Error Object",
      desc: "Every Error instance has name, message, and stack properties.",
      code: `const err = new Error("Something went wrong");\nerr.name; // "Error"`
    },
    {
      title: "Custom Error Classes",
      desc: "Extending Error lets you create domain-specific error types.",
      code: `class AppError extends Error {\n  constructor(message) { super(message); }\n}`
    },
    {
      title: "Async Error Handling",
      desc: "Async/await made error handling look synchronous, but unawaited Promises escape silently.",
      code: `async function fetchUser() {\n  try {\n    const res = await fetch('/api');\n  } catch (err) { }\n}`
    },
    {
      title: "finally — Guaranteed Cleanup",
      desc: "finally runs regardless of whether try succeeded or catch was triggered.",
      code: `try { } catch (e) { } finally { setLoading(false); }`
    }
  ],
  comparison: {
    headers: ["Error Type", "Category", "Retryable?"],
    rows: [
      ["Network timeout", "Operational", "Yes"],
      ["404 Not Found", "Operational", "No"],
      ["TypeError", "Programmer", "No — fix the code"]
    ]
  },
  mistakes: [
    {
      label: "Swallowing Errors",
      wrong: `catch (err) { }`,
      right: `catch (err) { throw new AppError("Failed"); }`,
      why: "Silent errors hide bugs."
    },
    {
      label: "Not Awaiting Promises",
      wrong: `try { db.insertUser(data); }`,
      right: `try { await db.insertUser(data); }`,
      why: "Unawaited Promises escape the try/catch."
    }
  ],
  challenge: {
    title: "Retry-with-Backoff",
    description: "Implement retry(fn, times).",
    initialCode: `async function retry(fn, times) { }`,
    testCases: [ { input: "[() => Promise.resolve(42), 3]", expected: "42" } ]
  },
  interview: [
    { level: "intermediate", q: "What happens to an unhandled Promise rejection?", a: "In Node 15+, it terminates the process." }
  ],
  cheatsheet: [
    "Always throw Error objects.",
    "await inside try/catch catches rejections.",
    "finally always runs."
  ]
},

{
  id:4, slug: "higher-order-functions", icon: "🛠️", color:"blue", title:"Higher-Order Functions", subtitle:"Callbacks & Functional Patterns",
  overview:{
    definition:"A Higher-Order Function (HOF) takes one or more functions as arguments, returns a function, or both. A callback is a function passed as an argument to another function. JavaScript treats functions as first-class citizens — they can be stored in variables, passed around, and returned like any value.",
    why:"HOFs enable code abstraction, separation of concerns, and powerful functional programming patterns. Instead of writing what to do for each item, you describe the transformation and let the HOF apply it.",
    react:"Array.map() renders lists of components. useEffect, useCallback, useMemo are HOFs. Event handlers are callbacks. Custom hooks return functions.",
    node:"Express middleware is a HOF callback. fs.readFile(path, callback). Event emitters use HOF pattern.",
    express:"app.get('/route', handler). Middleware factories return middleware functions. asyncHandler wraps async route handlers.",
      challenge: {
  "title": "Filter and Map",
  "description": "Given an array of objects with {name, age}, return an array of JUST the names of people who are 18 or older.",
  "initialCode": "function solve(users) {\\n  // Your code here\\n  return users;\\n}",
  "testCases": [
    {
      "input": "[{name: 'Alice', age: 20}, {name: 'Bob', age: 16}, {name: 'Charlie', age: 25}]",
      "expected": "['Alice', 'Charlie']"
    },
    {
      "input": "[{name: 'Dave', age: 17}]",
      "expected": "[]"
    }
  ]
},
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
  challenge: {
  "title": "Filter and Map",
  "description": "Given an array of objects with {name, age}, return an array of JUST the names of people who are 18 or older.",
  "initialCode": "function solve(users) {\\n  // Your code here\\n  return users;\\n}",
  "testCases": [
    {
      "input": "[[{name: 'Alice', age: 20}, {name: 'Bob', age: 16}, {name: 'Charlie', age: 25}]]",
      "expected": "['Alice', 'Charlie']"
    },
    {
      "input": "[[{name: 'Dave', age: 17}]]",
      "expected": "[]"
    }
  ]
},
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
  id:3, slug: "closures", icon: "🧬", color:"teal", title:"Closures", subtitle:"Lexical Scope & Memory",
  overview:{
    definition:"A closure is a function that retains access to variables from its outer (enclosing) scope even after that outer function has returned. Every function in JavaScript is a closure — it carries a reference to the scope where it was defined.",
    why:"JavaScript's event-driven, callback-heavy model requires functions to carry their environment with them when passed around. Closures package a function with its surrounding state.",
    react:"useState is built on closures. useEffect closures cause stale closure bugs. useCallback and useMemo use closures to cache. Every event handler in React is a closure.",
    node:"Middleware factories, module encapsulation, async callbacks, event handlers — all rely on closures.",
    express:"Rate limiting middleware factories, authentication closures, route handler factories all use closure patterns.",
      challenge: {
  "title": "Closure Counter",
  "description": "Write a function 'createCounter' that takes a starting number and returns a function. Every time the returned function is called, it should return the next number.",
  "initialCode": "function solve() {\\n  // Return a counter function\\n  return function createCounter(start) {\\n    \\n  };\\n}",
  "testCases": [
    {
      "input": "[5]",
      "expected": "[5, 6, 7]",
      "setup": "const counter = solve()(5); return [counter(), counter(), counter()];"
    }
  ]
},
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
  challenge: {
  "title": "Closure Counter",
  "description": "Write a function 'createCounter' that takes a starting number and returns a function. Every time the returned function is called, it should return the next number.",
  "initialCode": "function solve() {\\n  // Return a counter function\\n  return function createCounter(start) {\\n    \\n  };\\n}",
  "testCases": [
    {
      "input": "[5]",
      "expected": "[5, 6, 7]",
      "setup": "const counter = solve()(5); return [counter(), counter(), counter()];"
    }
  ]
},
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
  id:2, slug: "this-keyword", icon: "🎯", color:"purple", title:"this keyword", subtitle:"Execution Context & Binding",
  overview:{
    definition:"this refers to the object currently executing the code. Its value is NOT determined by where a function is defined, but by HOW it is called (the call site). There are four binding rules in priority order: new, explicit (call/apply/bind), implicit (obj.fn()), and default.",
    why:"JavaScript needed a way for methods to access the object they belong to. Without this, every method would need the object name hardcoded, making reuse impossible.",
    react:"Class components: this.state, this.setState(), binding event handlers in constructor. Arrow class properties solve binding automatically.",
    node:"Event emitter callbacks, class-based services, Express controllers all rely on this binding.",
    express:"Class-based route controllers need this bound — either in constructor or using arrow methods.",
      challenge: {
  "title": "Binding 'this'",
  "description": "Use an arrow function or .bind() to fix the implicit binding loss so the delayed greeting correctly prints 'Hello Alice'.",
  "initialCode": "function solve() {\\n  const user = {\\n    name: 'Alice',\\n    greet() {\\n      return function() {\\n        return 'Hello ' + this.name;\\n      };\\n    }\\n  };\\n  return user.greet()();\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "'Hello Alice'"
    }
  ]
},
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
  challenge: {
  "title": "Binding 'this'",
  "description": "Use an arrow function or .bind() to fix the implicit binding loss so the delayed greeting correctly prints 'Hello Alice'.",
  "initialCode": "function solve() {\\n  const user = {\\n    name: 'Alice',\\n    greet() {\\n      return function() {\\n        return 'Hello ' + this.name;\\n      };\\n    }\\n  };\\n  return user.greet()();\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "'Hello Alice'"
    }
  ]
},
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
  id:5, slug: "prototypes", icon: "🧱", color:"coral", title:"Prototypes", subtitle:"Prototype Chain & Inheritance",
  overview:{
    definition:"Every JavaScript object has a hidden [[Prototype]] link to another object. When you access a property, JS first checks the object itself, then follows this link chain until it finds the property or reaches null. ES6 class syntax is purely syntactic sugar over this prototype system.",
    why:"JavaScript uses prototype-based inheritance instead of class-based. Rather than copying methods into each instance, all instances share ONE copy via the prototype chain — memory-efficient and dynamic.",
    react:"React class components extend React.Component via the prototype chain. Understanding why super(props) is required, and why class methods need binding.",
    node:"EventEmitter is prototype-based. Stream classes, http.IncomingMessage all use prototype inheritance.",
    express:"Express Router and Application objects use prototype chains extensively.",
      challenge: {
  "title": "Prototype Method",
  "description": "Add a 'bark' method to the Dog prototype that returns 'Woof!'.",
  "initialCode": "function solve() {\\n  function Dog() {}\\n  // Add bark method here\\n  \\n  return new Dog().bark();\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "'Woof!'"
    }
  ]
},
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
  challenge: {
  "title": "Prototype Method",
  "description": "Add a 'bark' method to the Dog prototype that returns 'Woof!'.",
  "initialCode": "function solve() {\\n  function Dog() {}\\n  // Add bark method here\\n  \\n  return new Dog().bark();\\n}",
  "testCases": [
    {
      "input": "[]",
      "expected": "'Woof!'"
    }
  ]
},
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
  id: 15, slug: "es6-classes", icon: "🏛️", color: "coral", title: "ES6+ Classes", subtitle: "extends, super, Private Fields & Static Methods",
  overview: {
    definition: "ES6 classes are syntactic sugar over JavaScript's prototype-based inheritance system. What ES6 adds are ergonomic features: constructor(), extends, super(), static methods, and private class fields with the # prefix.",
    why: "ES6 classes were introduced to make the prototype system more approachable without changing the underlying mechanics.",
    react: "React class components (pre-hooks) are the canonical real-world use of JS classes.",
    node: "Node.js uses classes extensively internally: HTTP Server, EventEmitter, Stream.",
    express: "Production Express applications commonly use classes for Repository and Service layers.",
    interview: "Interviewers test OOP design and Prototype understanding."
  },
  mentalModel: {
    analogy: "A class is a blueprint for a house. extends is building a new blueprint that inherits features. Private fields (#) are locked rooms.",
    visual: `
class Dog extends Animal {
  #tricks = [];              // TRULY private (ES2022)
  constructor(name) {
    super(name);             // must call before using 'this'
  }
}`,
    misconceptions: [
      ["class creates a new object model", "class is 100% syntactic sugar. typeof Animal === 'function'."],
      ["private fields with _ are actually private", "The _ prefix is a convention. # fields are truly private."],
      ["static methods are inherited by instances", "Static methods live on the constructor, not instances."]
    ]
  },
  theory: [
    {
      title: "Constructor & Methods",
      desc: "Methods defined in the class body are placed on the prototype.",
      code: `class BankAccount {\n  constructor(owner) { this.owner = owner; }\n  deposit() { }\n}`
    },
    {
      title: "Inheritance",
      desc: "extends sets up prototype chain inheritance.",
      code: `class Circle extends Shape {\n  constructor(r) { super(); this.r = r; }\n}`
    },
    {
      title: "Private Fields",
      desc: "ES2022 private fields (#).",
      code: `class Counter {\n  #count = 0;\n  increment() { this.#count++; }\n}`
    }
  ],
  comparison: {
    headers: ["Feature", "ES5", "ES6 Class"],
    rows: [
      ["Syntax", "function Person() {}", "class Person {}"],
      ["Super call", "Parent.call(this)", "super()"],
      ["Private", "Convention (_name)", "# prefix"]
    ]
  },
  mistakes: [
    {
      label: "Forgetting super()",
      wrong: `constructor() { this.name = "X"; super(); }`,
      right: `constructor() { super(); this.name = "X"; }`,
      why: "this doesn't exist until super() returns."
    }
  ],
  challenge: {
    title: "Type-Safe Event Emitter",
    description: "Implement EventEmitter class.",
    initialCode: `class EventEmitter { }`,
    testCases: [ { input: "[]", expected: "[]" } ]
  },
  interview: [
    { level: "faang", q: "Explain V8 Hidden Classes with Classes.", a: "V8 builds Hidden Classes incrementally. Same constructor property order = fast access." }
  ],
  cheatsheet: [
    "class is syntactic sugar.",
    "super() must be the first statement in a derived constructor — this doesn't exist until super() returns.",
    "ES2022 private fields (#) are truly private, enforced by the JS engine.",
    "Static methods belong to the class constructor, not instances."
  ]
},

{
id: 34,
slug: "classes-oop",
icon: "🏗️",
color: "amber",
title: "ES6+ Classes & OOP Patterns",
subtitle: "Prototypes, syntactic sugar, delegation, and true privacy.",
overview: {
definition: "JavaScript's `class` keyword (ES2015) is syntactic sugar over its native prototypal inheritance model. Unlike classical OOP languages (Java/C++) where classes are rigid blueprints compiled into memory layouts, JS classes are runtime objects themselves (functions) that establish dynamic delegation links (`[[Prototype]]`) between objects.",
why: "Deep knowledge of prototypes prevents performance bottlenecks (duplicating methods on instances instead of the prototype) and subtle bugs regarding `this` binding. Understanding modern `#` private fields vs older closures/WeakMaps is vital for secure library design.",
react: "Pre-React 16.8, class components ruled the ecosystem. Understanding how `super(props)` initializes the prototype chain and why class methods required `.bind(this)` in constructors is essential for maintaining legacy React codebases.",
node: "Node's standard library (like `EventEmitter`, `Stream`) heavily relies on prototypal inheritance. Extending these classes correctly is fundamental to writing custom Node modules.",
express: "Creating complex, encapsulated controllers and service singletons in MVC Express architectures.",
challenge: {
title: "Implement Prototypal Inheritance",
description: "Without using the `class` keyword, write a function `Dog` that inherits from `Animal`. `Animal` has a `speak` method on its prototype. Ensure the prototype chain is set up correctly using `Object.create`.",
initialCode: "function Animal() {}\nAnimal.prototype.speak = function() { return 'noise'; };\n\nfunction Dog() {\n  // your code here\n}\n// set up inheritance here",
testCases: [
{ input: "const d = new Dog(); d.speak()", expected: "'noise'" },
{ input: "const d = new Dog(); d instanceof Animal", expected: "true" }
]
},
interview: "Interviews often ask you to implement classical inheritance using raw ES5 functions to prove you understand `Object.create()`, `.prototype`, and `__proto__`."
},
mentalModel: {
analogy: "Classical inheritance is a Xerox machine: copying a blueprint to build a car. If the blueprint changes later, existing cars don't change. Prototypal inheritance is a hotline. If an object doesn't know how to do something, it calls its prototype. If you teach the prototype a new trick, ALL connected objects instantly learn it.",
visual: "Instance Object ──(**proto**)──► Class.prototype ──(**proto**)──► Object.prototype\n{ a: 1 }                           { method() }                   { toString() }\n\nLookup 'toString':\n1. Found in Instance? No.\n2. Found in Class.prototype? No.\n3. Found in Object.prototype? YES. Execute.",
misconceptions: [
["Classes behave exactly like they do in Java", "JS classes do not physically copy methods to instances. They link objects via a live prototype chain. Changing `MyClass.prototype.method = ...` at runtime changes the behavior of all previously instantiated objects."],
["TypeScript 'private' is secure", "TS `private` is a compile-time strictness check. It is completely erased at runtime. You can still access `instance.privateVar` in compiled JS. Use ES2022 `#` for true runtime privacy."],
["Arrow functions inside classes are free", "Defining `method = () => {}` inside a class binds it to the instance, not the prototype. This means every single object instantiated creates a brand new copy of that function in memory, losing the memory benefits of prototypes."]
]
},
theory: [
{
title: "The Syntactic Sugar of Class",
desc: "Under the hood, a class creates a constructor function and attaches methods to that function's `.prototype` object.",
code: "class User {\n  constructor(name) { this.name = name; }\n  sayHi() { return this.name; }\n}\n\n// Under the hood (ES5 equivalent):\n// function User(name) { this.name = name; }\n// User.prototype.sayHi = function() { return this.name; };"
},
{
title: "Extends & Super",
desc: "The `extends` keyword links two prototypes: the instance prototypes (`Child.prototype` -> `Parent.prototype`) AND the static constructor functions themselves (`Child` -> `Parent`). `super()` invokes the parent constructor.",
code: "class Animal {\n  constructor(name) { this.name = name; }\n}\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name); // MUST be called before accessing 'this'\n    this.breed = breed;\n  }\n}"
},
{
title: "Static Methods",
desc: "Static methods are attached directly to the class constructor function, not the prototype. They cannot be called on instances and do not have access to instance-level `this`.",
code: "class MathUtils {\n  static add(a, b) { return a + b; }\n}\nconsole.log(MathUtils.add(2, 3)); // 5\n\nconst util = new MathUtils();\n// util.add(); // TypeError: util.add is not a function"
},
{
title: "True Private Fields (#)",
desc: "Introduced in ES2022, prefixing a property or method with `#` enforces strict runtime privacy using internal engine slots. They cannot be accessed outside the class, not even dynamically via `obj['#field']`.",
code: "class Wallet {\n  #balance = 0;\n  \n  deposit(amount) {\n    this.#balance += amount;\n  }\n  getBalance() {\n    return this.#balance;\n  }\n}\nconst myWallet = new Wallet();\n// myWallet.#balance; // SyntaxError: Private field"
}
],
cheatsheet: [
{ label: "class", desc: "Syntactic sugar for creating constructor functions and prototype chains." },
{ label: "constructor", desc: "Initialization method automatically called when using `new`." },
{ label: "super()", desc: "Calls the parent constructor. Must be called before `this` in a subclass." },
{ label: "static", desc: "Attaches a method directly to the Class, rather than the prototype." },
{ label: "extends", desc: "Sets up prototypal delegation between two classes." },
{ label: "#private", desc: "ES2022 syntax for true, hard-enforced runtime private fields/methods." },
{ label: "get / set", desc: "Binds an object property to a function that executes on lookup/assignment." },
{ label: "Object.create(null)", desc: "Creates an object with no prototype. Immune to prototype pollution." }
],
interview: [
{
q: "How does `extends` differ from `Object.create()`?",
a: "`Object.create(proto)` creates a single new object whose internal `[[Prototype]]` points to `proto`. `extends` does much more: it wires up the prototype chain for the instance (`Child.prototype = Object.create(Parent.prototype)`), wires up the static chain so child classes inherit static methods (`Object.setPrototypeOf(Child, Parent)`), and enforces that `super()` must be called.",
difficulty: "Advanced"
},
{
q: "Before `#` private fields existed, how did we achieve privacy in JavaScript?",
a: "The most common way was closures. You declare variables inside the constructor using `let` or `const` and create privileged methods inside the constructor that capture those variables. A more memory-efficient approach was using a module-level `WeakMap`, using `this` as the key and the private data as the value.",
difficulty: "Intermediate"
},
{
q: "What happens if you don't call `super()` in a subclass constructor?",
a: "A `ReferenceError` is thrown. When a class `extends` another, the JavaScript engine dictates that the parent class is responsible for creating the `this` binding. Until `super()` completes, the `this` keyword simply does not exist in the subclass context.",
difficulty: "Beginner"
},
{
q: "Why is assigning an arrow function as a class property considered a memory trade-off?",
a: "Standard class methods are placed on the `prototype` object, meaning 100,000 instances share the exact same function in memory. Class property arrow functions (`method = () => {}`) are bound to the instance, meaning they are freshly instantiated 100,000 times, consuming significantly more memory in exchange for auto-binding `this`.",
difficulty: "FAANG"
}
]
},

{
  id: 7, slug: "event-loop", icon: "⏳", color: "blue", title: "Event Loop", subtitle: "Microtasks, Macrotasks & Concurrency",
  overview: {
    definition: "The Event Loop is V8's mechanism for achieving non-blocking I/O in a single-threaded environment. It continuously monitors the Call Stack and the task queues — when the stack is empty, it first drains ALL pending microtasks, then dequeues one macrotask and pushes it onto the stack for execution.",
    why: "JavaScript was designed for the browser in 1995 to handle user interactions. A multi-threaded model would introduce race conditions on the DOM. Brendan Eich chose a single-threaded, event-driven model — the browser handles async work (timers, network) via Web APIs, and the Event Loop coordinates when those callbacks re-enter JS.",
    react: "React 18's Concurrent Renderer is built around the Event Loop. startTransition yields back to the loop between renders so high-priority updates aren't blocked. useEffect callbacks are scheduled after paint as macrotasks.",
    node: "Node.js uses libuv, which has a 6-phase event loop. process.nextTick() fires between every phase — before any Promise microtasks — making it the highest-priority async mechanism in Node.",
    express: "In Express, any synchronous CPU-heavy work blocks the event loop entirely, starving ALL other requests. Node scales for I/O-bound work but requires worker_threads for CPU-bound tasks.",
    interview: "FAANG interviewers use Event Loop questions to filter developers. Predicting the exact console.log order of mixed setTimeout/Promise/sync code is a standard L5+ screen question."
  },
  mentalModel: {
    analogy: "Imagine a restaurant with ONE chef (the single JS thread). When an order needs time, the maître d' handles the wait. When ready, the ticket goes into the kitchen queue. BUT the chef also has a personal sticky-note board (microtask queue) for urgent follow-ups — those are ALWAYS checked and cleared before the chef looks at the next ticket.",
    visual: `
┌─────────────────────────────────────────────────────────┐
│                      JS ENGINE (V8)                     │
│                                                         │
│    CALL STACK                  HEAP (Memory)            │
│   ┌────────────┐              ┌──────────────────┐      │
│   │  sayHello  │              │  objects, arrays │      │
│   │   main()   │              │  closures, etc.  │      │
│   └────────────┘              └──────────────────┘      │
└──────────────┬──────────────────────────────────────────┘
               │ delegates async work
┌──────────────▼──────────────────────────────────────────┐
│               WEB APIs / libuv (Node)                   │
│      setTimeout   fetch   DOM events   fs.readFile      │
└──────────┬─────────────────────────┬────────────────────┘
           │ timer / I/O done        │ Promise settled
    ┌──────▼──────────┐       ┌──────▼───────────┐
    │ MACROTASK QUEUE │       │ MICROTASK QUEUE  │
    │ setTimeout      │       │ Promise.then     │
    │ setInterval     │       │ queueMicrotask() │
    └──────┬──────────┘       └──────┬───────────┘
           │    Event Loop           │ ← drains FULLY first
           └──────────────┬──────────┘
                          ▼
                     CALL STACK`,
    misconceptions: [
      ["setTimeout(fn, 0) runs right after current code", "It schedules fn into the macrotask queue. ALL sync code AND ALL pending microtasks run first."],
      ["Promise.then() callbacks run synchronously", "Promise.then() is ALWAYS async. Callbacks are queued as microtasks even on resolved Promises."],
      ["The Event Loop runs on a separate thread", "The Event Loop IS the single thread. Web APIs use OS threads, but callbacks always re-enter JS on the single thread."],
      ["async/await runs code in parallel", "async/await is syntactic sugar over Promises. 'await' suspends only the current async function and yields to the loop."]
    ]
  },
  theory: [
    {
      title: "The Call Stack",
      desc: "A LIFO structure tracking function execution. No queued task can start until the stack is completely empty.",
      code: `function c() { console.log('c'); }
function b() { c(); console.log('b'); }
function a() { b(); console.log('a'); }
a();
// Output: c  b  a`
    },
    {
      title: "Macrotask Queue",
      desc: "Scheduled by Web APIs: setTimeout, setInterval, setImmediate, I/O. The loop picks ONE macrotask per iteration.",
      code: `console.log('1 - sync');
setTimeout(() => console.log('2 - macrotask'), 0);
console.log('3 - sync');
// Output: 1, 3, 2`
    },
    {
      title: "Microtask Queue",
      desc: "Sources: Promise.then, queueMicrotask. After every task, the ENTIRE microtask queue drains before the next macrotask.",
      code: `console.log('1 - sync');
setTimeout(() => console.log('2 - macro'), 0);
Promise.resolve().then(() => console.log('3 - micro'));
console.log('4 - sync');
// Output: 1, 4, 3, 2`
    },
    {
      title: "Node.js Event Loop Phases",
      desc: "Node's loop has 6 phases. process.nextTick() fires between every phase.",
      code: `setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
// Output: nextTick → promise → setTimeout → setImmediate`
    }
  ],
  comparison: {
    headers: ["Feature", "Microtask (Promise.then)", "Macrotask (setTimeout)"],
    rows: [
      ["Sources", "Promise.then, queueMicrotask", "setTimeout, setImmediate, I/O"],
      ["Priority", "HIGH — runs before next macrotask", "LOW — runs after microtasks drain"],
      ["Queue drain", "ALL run per iteration", "ONE runs per iteration"],
      ["Can starve?", "Yes — infinite chains block", "No — one runs at a time"]
    ]
  },
  mistakes: [
    {
      label: "Expecting setTimeout(fn, 0) to run right away",
      wrong: `setTimeout(() => console.log('timeout'), 0);
console.log('sync'); // Output: sync → timeout`,
      right: `Promise.resolve().then(() => console.log('micro'));
setTimeout(() => console.log('timeout'), 0); // Output: micro → timeout`,
      why: "setTimeout schedules a macrotask. All sync code and microtasks run first."
    },
    {
      label: "Blocking the event loop",
      wrong: `app.get('/hash', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 12);
});`,
      right: `app.get('/hash', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 12);
});`,
      why: "Node is single-threaded. hashSync blocks the thread for 100ms, freezing all other requests."
    }
  ],
  challenge: {
    title: "Build a Promise-based sleep",
    description: "Implement `solve(ms)` that returns a Promise resolving with 'done' after `ms` milliseconds.",
    initialCode: `function solve(ms) {\n  // Return a Promise\n}`,
    testCases: [ { input: "[10]", expected: "'done'" } ]
  },
  interview: [
    { level: "beginner", q: "What is the Event Loop?", a: "It lets single-threaded JS handle async operations. It checks if the call stack is empty, drains microtasks, then runs one macrotask." },
    { level: "intermediate", q: "Microtask vs Macrotask?", a: "Microtasks (Promises) have higher priority. The entire microtask queue drains before the next macrotask (setTimeout) runs." }
  ],
  cheatsheet: [
    "Sync code always runs first.",
    "Microtasks (Promises) beat Macrotasks (setTimeout).",
    "Node.js priority: nextTick > Promise > setImmediate > setTimeout",
    "CPU-heavy work blocks the loop."
  ]
},

{
  id: 8, slug: "promises-async-await", icon: "🔄", color: "teal", title: "Promises & Async/Await", subtitle: "Asynchronous JavaScript Mastery",
  overview: {
    definition: "A Promise is an object representing the eventual completion or failure of an async operation. It exists in three states: pending, fulfilled, or rejected.",
    why: "Before Promises, async code relied on callbacks ('callback hell'). Promises introduced chainable APIs, and async/await made it read synchronously.",
    react: "Every data-fetching pattern in React is built on Promises. React 18 Suspense catches Promise throws.",
    node: "In Node.js, nearly every I/O operation is Promise-based.",
    express: "async route handlers require explicit error handling with try/catch to avoid hanging requests.",
    interview: "The most tested async topic at FAANG. Expect to implement Promise.all from scratch."
  },
  mentalModel: {
    analogy: "A Promise is a restaurant pager. Pending = waiting. Fulfilled = buzzing. Rejected = alarm. You attach handlers: 'when it buzzes, collect food' (.then).",
    visual: `
        ┌─────────────┐         ┌──────────────┐
        │  FULFILLED  │         │   REJECTED   │
        │ resolve(v)  │         │ reject(err)  │
        └──────┬──────┘         └──────┬───────┘
          .then(fn)               .catch(fn)`,
    misconceptions: [
      ["Resolved Promises run .then() synchronously", "No, they are always queued as microtasks."],
      ["async functions return the value directly", "They always return a Promise."],
      ["Promise.all cancels other Promises on reject", "It short-circuits, but others keep running."]
    ]
  },
  theory: [
    {
      title: "Promise States",
      desc: "Executor runs synchronously. Only the first resolve/reject call takes effect.",
      code: `const p = new Promise((resolve, reject) => resolve(42));
p.then(v => console.log(v));`
    },
    {
      title: "Promise Combinators",
      desc: "Four static methods handle multiple Promises.",
      code: `await Promise.all([p1, p2]); // fail-fast
await Promise.allSettled([p1, p2]); // wait all
await Promise.race([p1, p2]); // first to settle
await Promise.any([p1, p2]); // first success`
    },
    {
      title: "Parallel vs Sequential",
      desc: "Sequential awaiting of independent ops is a common performance bug.",
      code: `// Parallel is faster:
const [user, stats] = await Promise.all([fetchUser(), fetchStats()]);`
    }
  ],
  comparison: {
    headers: ["Method", "Resolves when", "Rejects when", "Best use case"],
    rows: [
      ["Promise.all()", "ALL fulfill", "ANY rejects", "Parallel dependent calls"],
      ["Promise.allSettled()", "ALL settle", "Never", "Batch operations"],
      ["Promise.race()", "FIRST settles", "FIRST rejects", "Timeout patterns"],
      ["Promise.any()", "FIRST fulfills", "ALL reject", "Fallback chains"]
    ]
  },
  mistakes: [
    {
      label: "Unnecessary sequential awaits",
      wrong: `const a = await f1();\nconst b = await f2();`,
      right: `const [a, b] = await Promise.all([f1(), f2()]);`,
      why: "Multiply latency unnecessarily."
    },
    {
      label: "Unhandled rejections in Express",
      wrong: `app.get('/', async (req, res) => { const data = await db.find(); res.json(data); });`,
      right: `// Use asyncHandler or try/catch to pass errors to next()`,
      why: "Express doesn't catch async throws automatically."
    }
  ],
  challenge: {
    title: "Implement Promise.allSettled",
    description: "Returns an array of status objects.",
    initialCode: `async function solve(promises) { }`,
    testCases: [ { input: "[[Promise.resolve(1)]]", expected: '[{"status":"fulfilled","value":1}]' } ]
  },
  interview: [
    { level: "intermediate", q: "Promise.all vs allSettled?", a: "all is fail-fast, allSettled waits for everything." },
    { level: "faang", q: "How does async/await desugar?", a: "It transforms into a generator + Promise state machine. await saves the frame and yields to the event loop." }
  ],
  cheatsheet: [
    "3 states: pending, fulfilled, rejected.",
    ".then() returns a NEW Promise.",
    "Promise.all = fail-fast. allSettled = resilient."
  ]
},

{
id: 37,
slug: "advanced-web-apis",
icon: "👁️",
color: "teal",
title: "Advanced Web APIs",
subtitle: "Observers, Layout Thrashing, and Asynchronous Storage.",
overview: {
definition: "Modern browsers expose APIs that allow developers to hook directly into the rendering pipeline and storage mechanisms without blocking the main thread. Observers (`Intersection`, `Mutation`, `Resize`) replace expensive event polling, while IndexedDB provides a fully asynchronous, transactional local database, superseding the synchronous limits of LocalStorage.",
why: "Tying logic to the `scroll` event triggers synchronous layout calculations ('Layout Thrashing'), which drops frame rates to single digits on mobile devices. Observers push these calculations to the browser's native C++ compositing thread, executing callbacks asynchronously for buttery smooth 60FPS UI interactions.",
react: "React's `useRef` and `useEffect` are heavily combined with `IntersectionObserver` to implement infinite scrolling, lazy loading images, and triggering animation frameworks when elements enter the viewport.",
node: "While Observers are strictly browser APIs, Node developers must understand IndexedDB if they are building PWAs, offline-first architectures, or dealing with client-side caching of heavy API payloads.",
express: "Designing API endpoints that output pagination cursors optimized for frontend IntersectionObserver infinite-scroll consumers.",
challenge: {
title: "Intersection Ratio Check",
description: "Write a function that accepts an array of IntersectionObserver entries and returns the number of elements that are strictly more than 50% visible.",
initialCode: "function solve(entries) {\n  // your code here\n  return 0;\n}",
testCases: [
{ input: "[{ intersectionRatio: 0.4 }, { intersectionRatio: 0.6 }]", expected: "1" }
]
},
interview: "FAANG UI engineering interviews focus heavily on Layout Thrashing. You must know exactly which JS properties force the browser to recalculate layouts (like `offsetHeight`) and how Observers bypass this."
},
mentalModel: {
analogy: "Using a `scroll` listener is like sitting in the passenger seat and asking 'Are we there yet?' every single millisecond. It exhausts the driver (the CPU). `IntersectionObserver` is setting an alarm clock. The driver handles the road, and the alarm only rings at the exact moment you reach the destination.",
visual: "Layout Thrashing vs Observers:\n\n[ Scroll Event ] ──► elem.getBoundingClientRect() ──► (Sync Layout Calculation) ──► UI Freezes\n\n[ Observer ] ──► Browser Internal Tracker ──► (Async Callback) ──► UI Smooth",
misconceptions: [
["LocalStorage is fast enough for everything", "LocalStorage relies on synchronous File I/O. Reading/writing large JSON strings blocks the main thread completely. IndexedDB is asynchronous and does not block UI rendering."],
["requestAnimationFrame replaces Observers", "`rAF` syncs your JS to the monitor's refresh rate (usually 60 times a second), which is great for animations. But doing layout checks inside `rAF` 60 times a second is still wildly inefficient compared to Observers firing exactly once when needed."],
["MutationObserver is for listening to user inputs", "It observes the DOM structure itself (added/removed nodes, changed attributes). It does not listen to JS properties or value changes inside an `<input>` field."]
]
},
theory: [
{
title: "IntersectionObserver",
desc: "Asynchronously observes changes in the intersection of a target element with an ancestor element or with a top-level document's viewport. It is the gold standard for lazy-loading.",
code: "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log('Element visible!');\n      observer.unobserve(entry.target);\n    }\n  });\n}, { threshold: 0.5 }); // Fire when 50% visible\n\nobserver.observe(document.getElementById('lazy-img'));"
},
{
title: "MutationObserver",
desc: "Provides the ability to watch for changes being made to the DOM tree. Useful for third-party scripts that need to react when a host site dynamically alters the DOM.",
code: "const observer = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    if (mutation.type === 'childList') {\n      console.log('Nodes added or removed.');\n    }\n  }\n});\n\nobserver.observe(document.body, { childList: true, subtree: true });"
},
{
title: "ResizeObserver",
desc: "Reports changes to the dimensions of an Element's content or border box. Unlike `window.resize`, it tracks individual elements independently, perfect for container queries.",
code: "const resizer = new ResizeObserver(entries => {\n  for (let entry of entries) {\n    console.log('New width:', entry.contentRect.width);\n  }\n});\nresizer.observe(document.querySelector('.card'));"
},
{
title: "Storage: LocalStorage vs IndexedDB",
desc: "LocalStorage is limited to 5MB, strictly strings, and blocks the main thread. IndexedDB allows hundreds of megabytes, stores raw JS objects (via Structured Clone), and uses async events/promises.",
code: "// LocalStorage (Sync & Blocking)\nlocalStorage.setItem('user', JSON.stringify(data));\n\n// IndexedDB relies on async transactions (Wrapper libraries like idb are common)\n// const db = await openDB('my-database', 1);\n// await db.put('storeName', { id: 1, data: rawObject });"
}
],
cheatsheet: [
{ label: "Layout Thrashing", desc: "Reading a geometric property (`offsetWidth`) immediately after writing a style, forcing a synchronous recalculation." },
{ label: "rootMargin", desc: "IntersectionObserver config. Grows/shrinks the bounding box used for intersection calculations." },
{ label: "threshold", desc: "IntersectionObserver config. Array of ratios [0, 0.5, 1] dictating when callbacks fire." },
{ label: "getBoundingClientRect()", desc: "Synchronous method that returns element size/position. High performance cost if used in loops." },
{ label: "IndexedDB", desc: "Low-level API for client-side storage of significant amounts of structured data." },
{ label: "requestAnimationFrame", desc: "Tells the browser you wish to perform an animation before the next repaint." }
],
interview: [
{
q: "Explain what Layout Thrashing is and give a code example.",
a: "Browsers queue up DOM changes to execute them efficiently. Layout thrashing happens when you force the browser to flush that queue synchronously by requesting a layout metric before the batch completes. Example: `elements.forEach(el => { el.style.height = '10px'; const h = el.offsetHeight; })`. Writing style, then immediately reading `offsetHeight` forces a full layout recalculation on every loop iteration.",
difficulty: "Advanced"
},
{
q: "How would you implement an infinite scroll mechanism efficiently?",
a: "I would use an `IntersectionObserver`. I would place a transparent 'sentinel' `<div>` at the very bottom of the list. The observer watches the sentinel. When `isIntersecting` is true, the callback triggers an API fetch for the next page, appends the new items, and pushes the sentinel further down. This removes the need for `scroll` event listeners entirely.",
difficulty: "Intermediate"
},
{
q: "Why is saving state to LocalStorage inside a React component's render cycle dangerous?",
a: "LocalStorage API (`getItem`, `setItem`) is entirely synchronous and involves disk I/O. If called during the render phase, it blocks the main thread, delaying React's commit phase and freezing the browser UI. It should be deferred to a `useEffect` and debounced, or moved to asynchronous IndexedDB for large objects.",
difficulty: "FAANG"
},
{
q: "When would you use a `MutationObserver`?",
a: "They are rarely needed in standard React/Vue apps because the framework controls the DOM. They are vital when building browser extensions that must inject UI elements when a target website dynamically loads content, or when building rich text editors that need to sanitize raw user HTML pasting in real-time.",
difficulty: "Intermediate"
}
]
},

{
id: 35,
slug: "web-workers",
icon: "🧵",
color: "purple",
title: "Web Workers & Parallelism",
subtitle: "True OS threading, SharedArrayBuffer, and Atomics.",
overview: {
definition: "JavaScript is inherently single-threaded, driven by an Event Loop. Web Workers bypass this limitation by spawning true OS-level threads. Workers execute in separate global contexts, isolating them from the DOM, and communicate with the main thread via asynchronous message passing or zero-copy shared memory.",
why: "Heavy CPU tasks (image processing, cryptography, massive data parsing) block the main thread, freezing the UI to 0 FPS. Offloading these to Web Workers ensures 60 FPS fluidity. Understanding parallel memory management dictates the upper limits of frontend performance.",
react: "React 18's concurrent mode doesn't use Web Workers; it uses time-slicing on the main thread. However, computationally heavy React apps often dispatch Redux actions that trigger Web Worker calculations, updating state via `postMessage` callbacks.",
node: "Node.js utilizes `worker_threads`. Unlike standard child processes that isolate memory completely via IPC, worker threads can share memory using `SharedArrayBuffer`, essential for multithreaded backend pipelines.",
express: "Offloading intensive tasks (like bcrypt hashing or PDF generation) from the main Express event loop to worker pools, preventing one heavy request from bottlenecking hundreds of lightweight requests.",
challenge: {
title: "Worker Message Intercept",
description: "Simulate a worker environment. Write a function `dispatch(msg)` that adds a string to an array, and `onMessage()` that returns the total count of messages.",
initialCode: "let messages = [];\nfunction dispatch(msg) {\n  // your code here\n}\nfunction onMessage() {\n  // your code here\n}",
testCases: [
{ input: "dispatch('a'); dispatch('b'); onMessage()", expected: "2" }
]
},
interview: "FAANG interviews focusing on performance will probe your understanding of the `Structured Clone` overhead. Transferring a 50MB JSON object via `postMessage` blocks the thread during cloning. `Transferable Objects` and `SharedArrayBuffer` are the FAANG-tier solutions."
},
mentalModel: {
analogy: "The Main Thread is a brilliant chef running a kitchen. If they stop to slowly peel 1,000 potatoes (CPU blocking task), no food goes out. A Web Worker is hiring a prep cook in a separate room. The chef shouts 'peel these' (postMessage). When the prep cook finishes, they shout back, and the chef immediately uses them without having stopped cooking.",
visual: "Main Thread                         Web Worker (OS Thread)\n┌─────────────┐   postMessage()     ┌─────────────┐\n│ UI Renders  ├────────────────────►│ CPU Task    │\n│ Interactions│                     │             │\n│             │◄────────────────────┤ Result      │\n└─────────────┘   onmessage         └─────────────┘\n       │\nSharedArrayBuffer (Shared Memory Pool directly accessed by both)",
misconceptions: [
["Web Workers have access to the DOM", "Workers run in `DedicatedWorkerGlobalScope`. They cannot read or modify the DOM, `window`, or `document`. They are purely for data computation."],
["Promises execute in a separate thread", "Promises and `async/await` are purely concurrent abstractions over the single-threaded Event Loop. They do NOT spawn threads. A blocking `while(true)` inside a Promise will still freeze the entire browser."],
["postMessage is infinitely fast", "`postMessage` uses the Structured Clone algorithm. Sending large objects requires the engine to serialize and deserialize the memory, which itself is a synchronously blocking operation."]
]
},
theory: [
{
title: "The Web Worker API",
desc: "Instantiating a worker points to a separate JS file. Communication is bidirectional using `postMessage` and event listeners.",
code: "// Main Thread\nconst worker = new Worker('worker.js');\nworker.postMessage({ cmd: 'start', data: 42 });\nworker.onmessage = (e) => console.log('Result:', e.data);\n\n// worker.js\nself.onmessage = (e) => {\n  const result = e.data.data * 2;\n  self.postMessage(result);\n};"
},
{
title: "Transferable Objects",
desc: "To avoid the cloning overhead of `postMessage`, certain structures like `ArrayBuffer` can be strictly *transferred*. Ownership of the memory is yielded to the worker, immediately clearing it from the main thread.",
code: "const buffer = new ArrayBuffer(1024 * 1024); // 1MB\n// Transfer ownership. The buffer in main thread becomes length 0\nworker.postMessage({ data: buffer }, [buffer]);"
},
{
title: "SharedArrayBuffer & Atomics",
desc: "Allows two threads to read/write the exact same memory space simultaneously. To prevent race conditions (two threads writing at the same millisecond), the `Atomics` API provides safe, lock-enforced operations.",
code: "// Create 4 bytes of shared memory\nconst sharedBuffer = new SharedArrayBuffer(4);\nconst sharedArray = new Int32Array(sharedBuffer);\n\n// In Worker:\n// Safely add 5 to index 0, guaranteeing no race conditions\nAtomics.add(sharedArray, 0, 5);"
},
{
title: "Node.js worker_threads",
desc: "Node's solution for CPU-bound tasks. It shares the same V8 isolate underlying architecture but creates independent instances of V8 and Event Loops per thread.",
code: "const { Worker, isMainThread, parentPort } = require('worker_threads');\nif (isMainThread) {\n  const worker = new Worker(__filename);\n  worker.on('message', msg => console.log(msg));\n} else {\n  parentPort.postMessage('Hello from Thread!');\n}"
}
],
cheatsheet: [
{ label: "new Worker(url)", desc: "Spawns a new dedicated worker thread executing the provided script." },
{ label: "postMessage(data)", desc: "Sends data between threads using the Structured Clone algorithm." },
{ label: "self", desc: "The global context inside a worker (replacing `window`)." },
{ label: "Transferable", desc: "Zero-copy memory transfer. Original reference becomes detached/voided." },
{ label: "SharedArrayBuffer", desc: "Memory space shared across multiple threads. Requires secure context (HTTPS/CORS)." },
{ label: "Atomics", desc: "Static methods ensuring predictable reads/writes to SharedArrayBuffers." },
{ label: "Service Worker", desc: "A proxy worker sitting between the browser and network, used for caching and PWA offline mode." }
],
interview: [
{
q: "Explain the 'Structured Clone' algorithm and its limitations.",
a: "It is the engine's mechanism for duplicating JS objects for `postMessage` or IndexedDB. Unlike JSON.parse(JSON.stringify()), it supports circular references, Dates, RegExp, and Maps. However, it cannot clone Functions, DOM nodes, or prototype chains. Attempting to pass a class instance will strip its methods.",
difficulty: "Intermediate"
},
{
q: "If promises are single-threaded, how does `fetch()` resolve without blocking the thread?",
a: "`fetch` hands the network request off to the operating system's networking stack (often written in C++). The OS handles the TCP/IP connection in the background. The JS thread continues executing. Once the OS receives the HTTP response, it places a callback into the Macrotask Queue, which the JS Event Loop eventually executes.",
difficulty: "Intermediate"
},
{
q: "Why are Atomics necessary when using SharedArrayBuffer?",
a: "Because true multithreading allows race conditions. If Thread A and Thread B both execute `arr[0]++` simultaneously, they might both read `0`, increment to `1`, and write `1`, dropping a count. `Atomics.add(arr, 0, 1)` locks the memory address at the hardware level, ensuring the read-increment-write cycle completes uninterrupted.",
difficulty: "FAANG"
},
{
q: "What is the difference between a Web Worker and a Service Worker?",
a: "A Web Worker is purely for background CPU computation and has no persistent lifecycle. A Service Worker acts as a network proxy. It intercepts HTTP requests (fetch events), caches assets for offline functionality, and handles background syncs and push notifications. Service Workers outlive the web page session.",
difficulty: "Advanced"
}
]
},

{
  id:6, slug: "es6-features", icon: "📘", color:"green", title:"ES6+ Features", subtitle:"Modern JavaScript Syntax",
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
  id: 16, slug: "iterables-iterators", icon: "🔄", color: "indigo", title: "Iterables & Iterators", subtitle: "Symbol.iterator, for...of & Generators",
  overview: {
    definition: "An Iterable is any object that implements the Symbol.iterator method, returning an Iterator. An Iterator is an object with a .next() method that returns { value, done }.",
    why: "Iterators provide a standardized protocol, enabling the for...of loop and the spread operator (...) to work on ANY data structure.",
    react: "When you map over an array to return JSX, you are leveraging iterables.",
    node: "Node.js Streams are Async Iterables! You can use for await...of natively.",
    express: "Streaming responses often rely on iterators and generators.",
    interview: "FAANG interviews love iterators because they test algorithmic thinking."
  },
  mentalModel: {
    analogy: "An Iterable is a book. The Iterator is a bookmark. The book defines the content, the bookmark tracks the page.",
    visual: `
Iterable Object (e.g., Array)
 └─ [Symbol.iterator]() ──► returns an Iterator

Iterator Object
 ├─ next() ──► { value: 1, done: false }`,
    misconceptions: [
      ["Objects are iterable by default", "Plain objects {} are NOT iterable."],
      ["for...in and for...of are the same", "for...in iterates Keys. for...of iterates Values."],
      ["Generators are threads", "Generators are coroutines on the main thread."]
    ]
  },
  theory: [
    {
      title: "Iterable Protocol",
      desc: "Implement [Symbol.iterator]().",
      code: `const iterable = { [Symbol.iterator]() { return { next: () => ({ value: 1, done: true }) }; } };`
    },
    {
      title: "Generators",
      desc: "Syntactic sugar for iterators.",
      code: `function* gen() { yield 1; yield 2; }\nconst iter = gen();\niter.next();`
    },
    {
      title: "Async Iterators",
      desc: "Use for await...of.",
      code: `async function* fetchPages() { yield await fetch('/api'); }`
    }
  ],
  comparison: {
    headers: ["Loop", "Iterates Over"],
    rows: [
      ["for...of", "Values"],
      ["for...in", "Keys"]
    ]
  },
  mistakes: [
    {
      label: "Spreading Plain Objects",
      wrong: `const arr = [...{}];`,
      right: `const arr = Object.values({});`,
      why: "Plain objects do not have Symbol.iterator."
    }
  ],
  challenge: {
    title: "Fibonacci Generator",
    description: "Write an infinite Fibonacci generator.",
    initialCode: `function* fibonacci() { }`,
    testCases: [ { input: "[]", expected: "0" } ]
  },
  interview: [
    { level: "advanced", q: "How do Generators work under the hood?", a: "Compiled down to state machines via closures." }
  ],
  cheatsheet: [
    "Iterable: Has [Symbol.iterator]().",
    "Iterator: Has next() returning { value, done }.",
    "for...of loop consumes iterables automatically.",
    "Generators (function*) are syntactic sugar."
  ]
},

{
id: 36,
slug: "regex",
icon: "🔤",
color: "red",
title: "Regular Expressions & Text Processing",
subtitle: "NFA engines, Catastrophic Backtracking, and Lookarounds.",
overview: {
definition: "JavaScript utilizes an NFA (Nondeterministic Finite Automaton) Regex engine. Regular expressions provide a declarative syntax for pattern matching. Advanced utilization requires understanding internal backtracking mechanics, lookarounds (assertions without consuming characters), and balancing greedy versus lazy quantifiers.",
why: "Poorly constructed regex can crash entire Node servers. An unoptimized regex operating on untrusted input can trigger ReDoS (Regex Denial of Service), causing the single-threaded CPU to lock at 100% for minutes while resolving catastrophic backtracking.",
react: "Form validation logic (emails, passwords, phone numbers) before submission. Using regex in controlled components to mask or sanitize inputs instantly on every keystroke.",
node: "Parsing logs, sanitizing database queries, and extracting metadata from vast streams of text. Knowing how to write secure regex prevents server-crashing payloads.",
express: "Express router parameters support regex natively (e.g., `app.get('/user/:id(\\\\d+)')`) to restrict route matching to specific string structures.",
challenge: {
title: "Match Valid Hex Colors",
description: "Write a regex pattern that matches valid Hex colors. They start with `#`, followed by either exactly 3 or exactly 6 hexadecimal characters (a-f, A-F, 0-9).",
initialCode: "function solve(str) {\n  const regex = /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i;\\n  return regex.test(str);\\n}",
testCases: [
{ input: "'#fff'", expected: "true" },
{ input: "'#zzzzzz'", expected: "false" }
]
},
interview: "FAANG regex questions usually focus on Lookarounds (e.g., 'Extract the dollar amount but only if preceded by an invoice number') and identifying ReDoS vulnerabilities in nested quantifiers."
},
mentalModel: {
analogy: "A Regex Engine is a maze runner. Greedy quantifiers (*) mean running down a path as fast and far as possible, then backing up step-by-step (backtracking) if the exit is missed. Lazy quantifiers (*?) mean taking one step, checking for the exit, taking another step. Lookarounds are binoculars: looking ahead to ensure a path is clear without actually walking down it.",
visual: "Catastrophic Backtracking (a+)+\nString: 'aaaaX'\n\nEngine tries to partition 'a's:\n[aaaa] X (Fail)\n[aaa][a] X (Fail)\n[aa][aa] X (Fail)\n[aa][a][a] X (Fail)\n[a][a][a][a] X (Fail)\n... tries 2^N combinations before failing.",
misconceptions: [
["Greedy is always faster than Lazy", "Greedy is faster if the target is near the end of the string. Lazy is faster if the target is near the beginning. Using `.*` blindly forces the engine to scan the entire document before backtracking."],
["Regex is the best tool for parsing HTML", "HTML is not a regular language; it requires infinite nesting depth tracking. Using regex to parse HTML is fragile and prone to edge cases. Use DOM parsers."],
["Lookarounds consume characters", "Lookarounds are zero-width assertions. They verify a condition exists, but the matcher's position in the string does not move forward. `(?=b)b` matches 'b'."]
]
},
theory: [
{
title: "Greedy vs Lazy Quantifiers",
desc: "Quantifiers like `*` (0 or more) and `+` (1 or more) are greedy by default, consuming as much text as possible. Appending `?` (e.g., `*?`) makes them lazy, consuming as little text as possible.",
code: "const text = '<div>hello</div>';\n\n// Greedy: matches from first < to last >\ntext.match(/<.*>/);  // ['<div>hello</div>']\n\n// Lazy: stops at the very first >\ntext.match(/<.*?>/); // ['<div>']"
},
{
title: "Lookaheads and Lookbehinds",
desc: "Assertions that check the surroundings of a match without including those surroundings in the final match result. Crucial for intersecting conditions.",
code: "const str = '100 USD and 200 EUR';\n\n// Positive Lookbehind: must be preceded by 'USD '\nconst match1 = str.match(/(?<=USD )\\d+/);\n\n// Positive Lookahead: must be followed by ' EUR'\nconst match2 = str.match(/\\d+(?= EUR)/); // ['200']"
},
{
title: "Named Capture Groups",
desc: "Instead of referencing capture groups by index (`match[1]`), ES2018 introduced named groups, allowing structured extraction into an object.",
code: "const regex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\nconst match = regex.exec('2025-10-31');\n\nconsole.log(match.groups.year);  // '2025'\nconsole.log(match.groups.month); // '10'"
},
{
title: "ReDoS & Catastrophic Backtracking",
desc: "Occurs when regex contains nested quantifiers (e.g., `(a+)+`) or overlapping alternations. If the string almost matches but fails at the end, the NFA engine attempts every mathematical permutation of backtracking, causing exponential time complexity $O(2^N)$.",
code: "// VULNERABLE REGEX\nconst redos = /^([a-zA-Z0-9]+\\s?)*$/;\n\n// Safe for standard input\nredos.test('hello world'); \n\n// CPU locks up trying to backtrack spaces and characters\nredos.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!');"
}
],
cheatsheet: [
{ label: "^ / $", desc: "Zero-width assertions. Matches the start (`^`) and end (`$`) of a string/line." },
{ label: ".*", desc: "Matches any character (except newline) greedily." },
{ label: ".*?", desc: "Matches any character lazily." },
{ label: "(?=...)", desc: "Positive Lookahead: Matches if followed by `...`." },
{ label: "(?!...)", desc: "Negative Lookahead: Matches if NOT followed by `...`." },
{ label: "(?<=...)", desc: "Positive Lookbehind: Matches if preceded by `...`." },
{ label: "(?<!...)", desc: "Negative Lookbehind: Matches if NOT preceded by `...`." },
{ label: "\b", desc: "Word boundary. Matches the position between a word char and a non-word char." }
],
interview: [
{
q: "What is catastrophic backtracking, and how do you prevent it?",
a: "It happens in NFA engines when an input fails a match near the end, and the regex contains overlapping quantifiers (like `(a+)+`). The engine tries every combination of splitting the characters, leading to exponential execution time. Prevent it by making quantifiers mutually exclusive, removing nested quantifiers, or using possessive quantifiers (not natively supported in JS, but emulated via lookaheads).",
difficulty: "Advanced"
},
{
q: "Write a regex that matches passwords requiring at least one uppercase, one lowercase, and one number.",
a: "You achieve this by stringing together multiple positive lookaheads from the start of the string. `/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$/`. Each lookahead scans the string independently. If all three assertions pass, the `.{8,}` finally consumes the characters.",
difficulty: "FAANG"
},
{
q: "What is the difference between `exec()` and `match()`?",
a: "`exec()` is a method on the RegExp object. If the regex has the `g` (global) flag, `exec` acts as an iterator, returning one match per call and advancing its `lastIndex` property. `match()` is a method on Strings. With the `g` flag, it returns an array of all matches immediately, but drops all capture group details.",
difficulty: "Intermediate"
},
{
q: "How would you strip all HTML tags from a string using Regex?",
a: "While a DOM parser is safer, a basic regex is `/<[^>]+>/g`. Using a negated character class `[^>]` is significantly faster and safer against ReDoS than using a lazy wildcard `/<.*?>/g` because it prevents the engine from backtracking across tags.",
difficulty: "Beginner"
}
]
},

{
  id:10, slug: "memory-management", icon: "⚙️", color:"gray", title:"Memory Management", subtitle:"Garbage Collection & Leaks",
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

{
id: 32,
slug: "complexity",
icon: "📈",
color: "orange",
title: "Big-O & Algorithmic Complexity",
subtitle: "Time, space, and engine-specific structural complexities.",
overview: {
definition: "Big-O notation mathematically describes the limiting behavior of a function as its arguments tend towards a particular value or infinity. In JavaScript, theoretical complexity meets engine reality: understanding V8's hidden classes, memory reallocation, and the structural differences between array methods is essential for Staff-level performance tuning.",
why: "A theoretical $O(N)$ algorithm can run 10x slower than an $O(N^2)$ algorithm for small $N$ due to CPU cache misses and constant factors. At scale, selecting $O(\log N)$ vs $O(N)$ operations dictates whether your Node server processes 10,000 requests per second or 10.",
react: "React's reconciliation algorithm (Virtual DOM diffing) is heavily optimized. A naive tree diff is $O(N^3)$, but React uses heuristic assumptions (elements of different types produce different trees, and stable `key` props) to achieve an $O(N)$ reconciliation process.",
node: "Event loop blocking. Since Node is single-threaded, executing an $O(N^2)$ operation on an array of 100,000 items synchronously blocks the main thread, freezing the server for all other incoming requests.",
express: "Optimizing route matching. Express internally iterates through routes. Massive route tables without proper prefix matching can degrade to $O(N)$ string comparisons per request, reducing API throughput.",
challenge: {
title: "Find Duplicate $O(1)$ Space",
description: "Given an array of integers nums containing $N + 1$ integers where each integer is in the range $[1, N]$ inclusive, find the duplicate number. You must solve it in $O(N)$ time and use only $O(1)$ extra space (Floyd's Tortoise and Hare).",
initialCode: "function solve(nums) {\n  // your code here\n  return -1;\n}",
testCases: [
{ input: "[1,3,4,2,2]", expected: "2" },
{ input: "[3,1,3,4,2]", expected: "3" }
]
},
interview: "FAANG interviews are rooted in Big-O. Interviewers test if you can analyze both time and space constraints. Mentioning amortized bounds or engine-level cache locality during algorithmic interviews distinguishes senior candidates."
},
mentalModel: {
analogy: "O(1) is grabbing a book directly from its shelf slot. O(N) is searching a bookshelf cover by cover. O(log N) is opening a dictionary precisely in the middle, determining which half your word is in, and repeating. Amortized O(1) is moving to a new, bigger house: most days you just walk in (O(1)), but occasionally you have to pack and move everything you own (O(N)).",
visual: "Time Complexity Growth Rates:\nO(N!)  O(2^N)   O(N^2)      O(N log N)\n  │      /       /         /\n  │     /       /       /  \n  │    /       /     /     O(N)\n  │   /       /   /        \n  │  /       / /           O(log N)\n  │ /       /              O(1)\n  └─────────────────────────────── N",
misconceptions: [
["Array.push() is always O(1) time", "It is AMORTIZED $O(1)$. When the underlying memory block fills up, V8 must allocate a new contiguous memory block (typically 1.5x larger) and copy all $O(N)$ existing elements over."],
["Objects and Maps have identical lookup complexities", "While both are theoretically $O(1)$, standard objects traverse the prototype chain on misses. Maps are strictly isolated hash tables, often yielding faster constant-time inserts/lookups in V8."],
["Recursion has O(1) space complexity if you don't declare variables", "Every recursive call pushes a frame onto the Call Stack. Standard recursion uses $O(N)$ space, risking a Stack Overflow. Only engines supporting Tail Call Optimization (TCO) can collapse this to $O(1)$."]
]
},
theory: [
{
title: "Amortized Analysis of Array Methods",
desc: "`push()` and `pop()` operate at the end of the array. Because memory is contiguous, adding an item is $O(1)$. Conversely, `unshift()` and `shift()` add/remove at the beginning, forcing the engine to shift the memory addresses of all $N$ subsequent elements, resulting in $O(N)$ time complexity.",
code: "const arr = [1, 2, 3];\n// O(1) - Amortized constant time\narr.push(4); \n\n// O(N) - Linear time. 1, 2, 3, and 4 must all move in memory.\narr.unshift(0);"
},
{
title: "Hash Tables & V8 Hidden Classes",
desc: "V8 optimizes object property access using Hidden Classes (Shapes). If you initialize objects identically, they share a Hidden Class, making lookups a rapid pointer offset. Adding properties dynamically creates transition chains, degrading performance.",
code: "// FAST: Same hidden class\nconst p1 = { x: 1, y: 2 };\nconst p2 = { x: 3, y: 4 };\n\n// SLOW: Forces hidden class transition\nconst p3 = { x: 5 };\np3.y = 6;"
},
{
title: "Space Complexity: Call Stack vs Heap",
desc: "Space complexity accounts for auxiliary heap allocations (creating new arrays/objects) AND call stack frames. Deeply nested recursion implies a linear space overhead, even without local variables.",
code: "// Space: O(N) due to Call Stack frames\nfunction sum(n) {\n  if (n === 1) return 1;\n  return n + sum(n - 1);\n}\n\n// Space: O(1) iterative\nfunction sumIterative(n) {\n  let total = 0;\n  for(let i = 1; i <= n; i++) total += i;\n  return total;\n}"
},
{
title: "Tail Call Optimization (TCO)",
desc: "TCO allows a recursive function to execute without growing the call stack if the recursive call is the absolutely last action in the function. In JS, only Safari (JavaScriptCore) strictly implements ES6 TCO.",
code: "// TCO-compatible recursion (Space: O(1) in Safari)\nfunction sumTCO(n, acc = 0) {\n  if (n === 0) return acc;\n  return sumTCO(n - 1, acc + n); // Strict tail call\n}"
}
],
cheatsheet: [
{ label: "$O(1)$ Constant", desc: "Hash Map lookup, Array index access, basic arithmetic." },
{ label: "$O(\log N)$ Logarithmic", desc: "Binary search, Tree traversals (balanced). Data space halves per step." },
{ label: "$O(N)$ Linear", desc: "Array iteration, `shift()`, `unshift()`, `indexOf()`." },
{ label: "$O(N \log N)$ Linearithmic", desc: "Efficient sorting algorithms: Merge Sort, Quick Sort (average), TimSort." },
{ label: "$O(N^2)$ Quadratic", desc: "Nested loops, Bubble Sort, computing pairwise distances." },
{ label: "$O(2^N)$ Exponential", desc: "Naive recursive Fibonacci, finding all subsets/combinations." },
{ label: "$O(N!)$ Factorial", desc: "Finding all permutations of a string or array." },
{ label: "Amortized $O(1)$", desc: "Operations that are typically $O(1)$ but occasionally spike to $O(N)$ (e.g., dynamic array resizing)." }
],
interview: [
{
q: "Explain why JavaScript engines prefer Map over Object for frequently updated key-value stores.",
a: "Objects are not purely hash tables in V8; they are optimized using Hidden Classes for fast property access when structures are static. When you constantly add/delete keys, you cause 'dictionary mode' deoptimizations and prototype chain traversals. `Map` is explicitly implemented as a deterministic hash table, guaranteeing fast amortized $O(1)$ insertions and preventing key collisions with prototype properties.",
difficulty: "Advanced"
},
{
q: "What is the time complexity of `Array.prototype.splice()`?",
a: "The time complexity is $O(N)$. Even if you are inserting/removing a single element, the engine must shift the memory blocks of all subsequent elements to maintain contiguous memory allocation.",
difficulty: "Intermediate"
},
{
q: "How does String concatenation complexity behave in modern JavaScript?",
a: "Historically, `str += 'a'` was $O(N)$, requiring memory reallocation for the entire new string. Modern engines (V8) use 'Ropes' or 'ConsStrings' under the hood. They store concatenations as a tree of pointers rather than copying memory immediately, making concatenation effectively $O(1)$ until the string is actually flattened (read/rendered).",
difficulty: "FAANG"
},
{
q: "If you have an array of 1,000,000 items and need to repeatedly check if elements exist, what do you do?",
a: "Using `Array.includes()` inside a loop yields $O(N^2)$ complexity. I would convert the array to a `Set` once, which takes $O(N)$ time and space. Subsequent `Set.has()` checks operate in $O(1)$ time, reducing the overall operation complexity to $O(N)$.",
difficulty: "Beginner"
}
]
},

{
id: 38,
slug: "heaps-tries",
icon: "🌲",
color: "green",
title: "Heaps & Tries",
subtitle: "FAANG Data Structures: Priority Queues and Prefix Trees.",
overview: {
definition: "Heaps and Tries are advanced tree-based data structures essential for optimal performance in specific domains. A Binary Heap is a complete binary tree implemented via an array, guaranteeing $O(\log N)$ insertions/extractions for Priority Queues. A Trie (Prefix Tree) is an $n$-ary tree where nodes store characters, enabling $O(L)$ searches for string dictionaries where $L$ is the word length.",
why: "Standard arrays require $O(N \log N)$ to constantly sort for the 'next best' item; Heaps do it in $O(\log N)$. When building Autocomplete systems or routing algorithms, Tries dramatically outperform hash maps when partial matching (prefixes) is required.",
react: "React's internal Scheduler uses a Min-Heap to manage task prioritization. High-priority user interactions are sifted to the top and executed before low-priority background renders.",
node: "Job queues handling tasks with varying priorities. A server might use an in-memory Heap to process 'VIP' webhooks before standard webhooks, avoiding a massive $O(N)$ sorting bottleneck.",
express: "Building internal cache layers or rate-limiting prefix matches. Tries are exceptionally fast for routing engines (like Express internals) to match URL paths efficiently without massive Regex arrays.",
challenge: {
title: "Trie Node Insertion",
description: "Write a function that inserts a word into a basic Trie object.",
initialCode: "function insert(trie, word) {\n  let curr = trie;\n  // your code here\n  // remember to set curr.isWord = true at the end\n}",
testCases: [
{ input: "let t = {}; insert(t, 'cat'); t.c.a.t.isWord", expected: "true" }
]
},
interview: "These are the absolute pinnacle of FAANG algorithms. You must know how to implement a Heap using array math (`2i+1`, `2i+2`) from scratch, as JavaScript uniquely lacks a built-in Priority Queue."
},
mentalModel: {
analogy: "A Heap is a corporate ladder. The CEO (Min/Max) is always at the very top. When a new person is hired at the bottom, they swap with their boss until they reach their correct rank (Sift-Up). A Trie is a massive physical dictionary with letter tabs. To find 'CAT', you open the 'C' section, flip to the 'A' pages, and scan for 'T'.",
visual: "Array-Based Binary Min-Heap:\nArray: [10, 15, 30, 40, 50]\n\n         10 (Index 0)\n       /    \\n    15(1)   30(2)\n   /    \\n 40(3) 50(4)\n\nMath:\nLeft Child: (2 * i) + 1\nRight Child: (2 * i) + 2\nParent: floor((i - 1) / 2)",
misconceptions: [
["A Heap is a fully sorted array", "A Heap only guarantees vertical order (parents are smaller/larger than children). Siblings have no guaranteed relationship. Therefore, an array representation of a heap is NOT perfectly sorted sequentially."],
["Hash Maps are always faster than Tries for strings", "Hash Maps are $O(1)$ for exact matches, but $O(N)$ to find all words starting with a specific prefix. Tries do prefix matching in $O(L)$ time."],
["JavaScript has built-in Heaps", "Unlike Python (`heapq`) or Java (`PriorityQueue`), JS has no native heap structure. You must implement `siftUp` and `siftDown` manually during interviews."]
]
},
theory: [
{
title: "Binary Heap Architecture",
desc: "Because Heaps are 'complete' trees (filled left-to-right), they are represented as flat arrays to save memory on node pointers. Navigation relies entirely on index math.",
code: "class MinHeap {\n  constructor() { this.heap = []; }\n  getLeftIndex(i) { return 2 * i + 1; }\n  getRightIndex(i) { return 2 * i + 2; }\n  getParentIndex(i) { return Math.floor((i - 1) / 2); }\n}"
},
{
title: "Heap Insertion (Sift-Up)",
desc: "Add the new element to the end of the array. Compare it with its parent. If it violates the heap property (e.g., smaller than parent in a Min-Heap), swap them. Repeat until the root is reached.",
code: "insert(val) {\n  this.heap.push(val);\n  let i = this.heap.length - 1;\n  while (i > 0 && this.heap[i] < this.heap[this.getParentIndex(i)]) {\n    const p = this.getParentIndex(i);\n    [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];\n    i = p;\n  }\n}"
},
{
title: "Tries (Prefix Trees)",
desc: "A tree where each node represents a character. Traversing down a branch spells out a string. A boolean flag `isWord` indicates a valid end-of-string.",
code: "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isWord = false;\n  }\n}\n// To insert 'cat':\n// root.children['c'] -> .children['a'] -> .children['t'].isWord = true;"
},
{
title: "Trie Prefix Search",
desc: "To find all autocomplete suggestions, you traverse to the node representing the end of the user's input prefix, then perform a Depth First Search (DFS) to collect all connected `isWord = true` nodes.",
code: "function startsWith(trieRoot, prefix) {\n  let curr = trieRoot;\n  for (const char of prefix) {\n    if (!curr.children[char]) return false;\n    curr = curr.children[char];\n  }\n  return true; // Prefix exists\n}"
}
],
cheatsheet: [
{ label: "Heap Insert", desc: "Time: $O(\log N)$. Add to end, sift up." },
{ label: "Heap Extract Root", desc: "Time: $O(\log N)$. Swap root with last element, pop end, sift down." },
{ label: "Heap Peek", desc: "Time: $O(1)$. Access array index 0." },
{ label: "Min-Heap", desc: "Parent is always smaller than or equal to its children." },
{ label: "Max-Heap", desc: "Parent is always greater than or equal to its children." },
{ label: "Trie Insert", desc: "Time: $O(L)$ where $L$ is word length. Iterates through characters." },
{ label: "Trie Search", desc: "Time: $O(L)$. Lightning fast prefix matching." },
{ label: "Dijkstra's Algorithm", desc: "Graph pathfinding algorithm that heavily relies on a Min-Heap to extract the next shortest node." }
],
interview: [
{
q: "Since JavaScript doesn't have a built-in Priority Queue, how would you merge K sorted arrays in an interview?",
a: "The optimal solution is $O(N \log K)$ using a Min-Heap. I would implement a minimalist Min-Heap class focusing only on `insert` and `extractMin`. I'd initialize the heap with the first element of each of the K arrays. Then, I repeatedly extract the minimum, push it to the results, and insert the next element from the array that the minimum originated from.",
difficulty: "FAANG"
},
{
q: "Explain why Heaps are implemented as Arrays instead of Node objects.",
a: "Memory efficiency and cache locality. Node objects require storing left/right pointers, doubling the memory footprint. Arrays allocate contiguous memory, avoiding pointer chasing across the heap. Index math (`2i+1`) is executed incredibly fast by the CPU, resulting in a significantly faster constant-time overhead.",
difficulty: "Advanced"
},
{
q: "How does a Trie handle memory overhead compared to a Hash Map for storing a dictionary?",
a: "Hash Maps store each string independently, meaning prefixes like 'anti' are duplicated thousands of times. Tries overlap identical prefixes perfectly in memory. However, each Trie Node requires creating an object/map for its children. If the dataset has low prefix overlap, the object overhead of a Trie consumes more memory than flat Hash Map strings.",
difficulty: "Advanced"
},
{
q: "What is the time complexity of building a heap from an unsorted array?",
a: "While inserting $N$ elements sequentially takes $O(N \log N)$, building it in place using Floyd's 'build-heap' algorithm (sifting down from the bottom up) operates in strictly $O(N)$ time. This mathematically works because the vast majority of nodes are at the bottom of the tree and require little to no sifting.",
difficulty: "FAANG"
}
]
},

{
id: 33,
slug: "advanced-typescript",
icon: "📘",
color: "blue",
title: "Advanced TypeScript Architecture",
subtitle: "Structural typing, Generics, `infer`, and Mapped Types.",
overview: {
definition: "TypeScript is a structural type system overlaid on JavaScript. Advanced TS moves beyond primitive annotations into type metaprogramming. Features like Conditional Types, Mapped Types, and the `infer` keyword allow developers to craft dynamic, Turing-complete type definitions that adapt based on the shapes of generic inputs.",
why: "In large codebases, rigid any/unknown casting masks runtime errors. Advanced TS allows you to write libraries (like Redux or TRPC) where the return type of a function perfectly mirrors its complex, deeply-nested input, providing zero-overhead compile-time safety.",
react: "Typing polymorphic components (`<Text as=\"h1\">`). Using generic constraints to ensure props automatically update depending on an `as` generic, or extracting prop types directly from native DOM elements using `ComponentProps`.",
node: "Typing complex database ORM responses (like Prisma) where selecting specific relational fields dynamically alters the returned TypeScript interface.",
express: "Creating strongly typed route handlers where the `req.body`, `req.query`, and `req.params` are implicitly inferred from a Zod schema or a generic routing table.",
challenge: {
title: "Type Guard & Discrimination",
description: "Write a runtime function `isDog` that acts as a type guard. In TS, this would use the signature `(animal: any): animal is Dog`. Return true if the object has a `bark` property.",
initialCode: "function isDog(animal) {\n  // your code here\n  return false;\n}",
testCases: [
{ input: "{ bark: () => {} }", expected: "true" },
{ input: "{ meow: () => {} }", expected: "false" }
]
},
interview: "FAANG interviews using TypeScript will test your understanding of its compilation mechanics (type erasure), the difference between structural and nominal typing, and advanced utility types."
},
mentalModel: {
analogy: "Nominal typing (Java/C#) is caring about the brand name on the shirt. Structural typing (TypeScript) is caring only if the shirt fits. If a variable requires an object with `{ id: string }`, TS doesn't care if it's explicitly instantiated as a 'User' class, it only checks if the 'id' property physically exists.",
visual: "Conditional Type Pipeline:\nInput Type (T) ──► T extends U ? ──► Yes: Return Type X\n                                 ──► No: Return Type Y\n\nMapped Type Pipeline:\n{ a: 1, b: 2 } ──► [K in keyof T] ──► { a: number, b: number }",
misconceptions: [
["TypeScript executes at runtime", "TypeScript is completely erased during compilation. Interfaces, Generics, and Types do not exist in the V8 engine and cannot affect runtime behavior."],
["'any' and 'unknown' are the same", "`any` disables the type checker completely. `unknown` is safe: you must explicitly narrow it (via `typeof` or type guards) before performing operations on it."],
["Enums are perfectly safe", "Numeric Enums in TypeScript are deeply flawed and allow reverse-mapping and out-of-bounds assignments. String Unions or `as const` objects are preferred."]
]
},
theory: [
{
title: "Structural vs Nominal Typing",
desc: "TypeScript uses Structural Typing (Duck Typing). If two objects share the same shape, they are considered the same type, regardless of their explicit class names or origins.",
code: "interface Vector2D { x: number; y: number; }\ninterface Point { x: number; y: number; }\n\n// Perfectly valid in TS, illegal in Java/C++\nlet vec: Vector2D = { x: 1, y: 2 };\nlet pt: Point = vec;"
},
{
title: "Conditional Types & 'infer'",
desc: "Conditional types evaluate types via ternary logic: `T extends U ? X : Y`. The `infer` keyword allows you to extract and assign a type variable dynamically during this evaluation.",
code: "// Extracts the return type from a function signature\ntype MyReturnType = T extends (...args: any[]) => infer R ? R : never;\n\nfunction getGreeting() { return 'hello'; }\ntype Greeting = MyReturnType; // string"
},
{
title: "Mapped Types & Key Remapping",
desc: "Mapped types iterate over keys using the `in` keyword. TS 4.1 introduced key remapping via `as`, allowing you to transform key names during iteration.",
code: "interface User { id: number; name: string; }\n\n// Create a type where every key has a 'get' prefix\ntype Getters = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]\n};\ntype UserGetters = Getters;\n// { getId: () => number; getName: () => string; }"
},
{
title: "Discriminated Unions & Exhaustive Checks",
desc: "Combining literal types with unions allows TS to narrow types elegantly. You can use the `never` type in a switch statement's default case to guarantee all variants are handled at compile time.",
code: "type Action = { type: 'ADD'; payload: number } | { type: 'RESET' };\n\nfunction reduce(action: Action) {\n  switch (action.type) {\n    case 'ADD': return action.payload;\n    case 'RESET': return 0;\n    default:\n      // Compile error if a new Action is added but not handled here\n      const _exhaustiveCheck: never = action;\n      return _exhaustiveCheck;\n  }\n}"
}
],
cheatsheet: [
{ label: "keyof T", desc: "Extracts a union of literal string keys from an object type." },
{ label: "typeof x", desc: "Extracts the type from a runtime javascript variable." },
{ label: "T extends U", desc: "Constraint: 'Is T assignable to U?' Used in generics and conditionals." },
{ label: "infer R", desc: "Declares a type variable `R` to extract a sub-type in a conditional." },
{ label: "Omit<T, K>", desc: "Utility type: constructs a type with properties `K` removed from `T`." },
{ label: "Pick<T, K>", desc: "Utility type: constructs a type by plucking properties `K` from `T`." },
{ label: "Record<K, T>", desc: "Constructs an object type with keys of type `K` and values `T`." },
{ label: "never", desc: "The bottom type. Represents a state that should never mathematically occur." }
],
interview: [
{
q: "Explain the difference between `any` and `unknown`.",
a: "`any` completely bypasses the compiler, essentially turning off TypeScript for that variable. You can call any method on it, risking runtime crashes. `unknown` is the type-safe counterpart. It signifies a value of unknown origin, but forces you to perform type narrowing (using `typeof`, `instanceof`, or custom type guards) before you can interact with its properties.",
difficulty: "Beginner"
},
{
q: "How can you simulate Nominal Typing in TypeScript?",
a: "Since TS is structurally typed, two identical shapes are interchangeable. To prevent this (e.g., distinguishing an `OrderId` string from a `UserId` string), you can use 'Branded Types' or 'Opaque Types'. You intersect the base type with a unique symbol or literal tag: `type OrderId = string & { readonly __brand: unique symbol }`.",
difficulty: "Advanced"
},
{
q: "What does the `infer` keyword do, and where can it be used?",
a: "The `infer` keyword can only be used within the `extends` clause of a conditional type. It acts as a declarative pattern matcher, telling the compiler to deduce the type of a specific section of a generic structure (like extracting the element type of an array or the arguments of a function) and assign it to a temporary type variable.",
difficulty: "Intermediate"
},
{
q: "Why does TypeScript sometimes complain about indexing objects with string keys, and how do you fix it?",
a: "If an object doesn't have an index signature (`[key: string]: any`), TS prevents you from indexing it dynamically via variables (e.g., `obj[dynamicKey]`) to preserve type safety. You fix it by typing the key as `keyof typeof obj`, or by casting the object to a `Record<string, any>` if dynamic indexing is genuinely required.",
difficulty: "Intermediate"
}
]
}

];

export const TOPIC_MAP = Object.fromEntries(TOPICS.map((t) => [t.slug, t]));
