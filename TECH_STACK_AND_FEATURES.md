# JS Handbook - Tech Stack & Features Overview

## 🛠️ Tech Stack & Tools Used
- **Frontend Framework:** **React 19** (`react` and `react-dom` v19.2.6)
- **Build Tool:** **Vite** v8 (using `@vitejs/plugin-react` for fast development and building)
- **Styling:** **Vanilla CSS** (`index.css` and `dark.css`). It doesn't use Tailwind or Bootstrap; instead, it relies entirely on a custom CSS variable-driven design system featuring Glassmorphism and responsive design.
- **Linting:** **ESLint** v10 with React hooks and refresh plugins for code quality.

## ✨ Core Features
1. **Custom Syntax Highlighter:** Instead of using a heavy library like Prism.js, the app includes a custom, lightweight Regex-based syntax highlighter right in `App.jsx` to colorize keywords, strings, comments, and functions.
2. **Rich Visualizations:** It provides ASCII-style mental models and architecture diagrams (like Scope Visualization and Prototype Chains) to help visualize how JS engines work under the hood.
3. **Interactive Code Snippets:** Side-by-side "Wrong vs. Right" code examples to demonstrate common pitfalls (like the classic loop + closure bug).
4. **Interview Prep Module:** Curated Q&A categorized by difficulty level (Beginner, Intermediate, Advanced, and FAANG) for every single topic.
5. **Comparison Tables:** Cleanly formatted tables that compare related concepts directly (e.g., comparing `var` vs `let` vs `const`, or `call` vs `apply` vs `bind`).
6. **Quick Cheatsheets:** Bite-sized, bulleted summaries at the end of each topic for rapid review.

## 📚 Topics Covered
The handbook is driven by a massive data array (`TOPICS`) covering the most crucial parts of JavaScript:
- **Variables & Scope:** `var`, `let`, `const`, Hoisting, and the Temporal Dead Zone (TDZ).
- **Execution Context:** The `this` keyword, arrow functions, and the 4 binding rules (implicit, explicit, `new`, and default).
- **Closures:** Lexical scope, memory models, preventing stale closures in React, and the module pattern.
- **Higher-Order Functions (HOFs):** Deep dives into callbacks, `map`, `filter`, `reduce`, `compose`, `pipe`, `debounce`, and `throttle`.
- **Prototypes:** Prototype chains, prototypal inheritance, and how ES6 classes are just syntactic sugar.

## 🏗️ Architecture Highlights
- **Single Page Application:** It operates heavily out of `App.jsx`, mapping over the `TOPICS` data structure.
- **Component Design:** It uses specialized, reusable functional components like `<Code />` (for snippets), `<Cmp />` (for tables), and `<Badge />` (for difficulty tags).
- **Theming System:** `index.css` maps out a comprehensive token system (e.g., `--color-text-primary`, `--c-kw` for keywords) making it incredibly easy to switch themes or maintain the dark mode aesthetics.
