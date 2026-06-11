<div align="center">
  <h1>🚀 The Advanced JavaScript Handbook (v2.0)</h1>
  <p><strong>A High-Performance, FAANG-Ready Interactive JavaScript Learning Platform</strong></p>

  [![React 19](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
  [![TanStack Start](https://img.shields.io/badge/TanStack_Start-Beta-red.svg?style=for-the-badge&logo=react)](https://tanstack.com/start)
  [![Vite](https://img.shields.io/badge/Vite-v7-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
  [![Vanilla CSS](https://img.shields.io/badge/CSS3-Custom_Design_System-1572B6.svg?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
</div>

---

## 📖 Overview

The **Advanced JavaScript Handbook** is a comprehensive, SSR-enabled interactive platform designed to demystify complex JavaScript engineering concepts. Built specifically for developers preparing for FAANG-level technical interviews, it dives deep into language internals—covering everything from the V8 Engine's Hidden Classes and Memory Management, to Event Loop Microtasks, Web Workers, and advanced TypeScript structural typing.

It operates entirely as a **custom-built, dependency-lean Single Page Application** to demonstrate advanced frontend architecture, performance optimization, and premium UI/UX design.

---

## ✨ Engineering Highlights & Features

This project was built from the ground up to demonstrate modern frontend engineering best practices:

- **📈 38 Exhaustive Deep Dives:** Expanding from basic fundamentals to absolute mastery. The curriculum recently passed a 100/100 comprehensive FAANG audit, addressing advanced algorithms (Tries, Heaps), Regex Catastrophic Backtracking, and SharedArrayBuffer memory locking.
- **⚡ Zero-Dependency Syntax Highlighter:** Instead of relying on heavy third-party libraries (like Prism.js or Highlight.js) which bloat the bundle size, the app features a proprietary, lightweight regex-based AST parser to handle syntax highlighting on the fly.
- **🎨 Custom CSS Variable-Driven Design System:** Entirely built without Tailwind or Bootstrap. The UI features a custom semantic token system, enabling a seamless dark-mode experience, Glassmorphism effects, dynamic "Resume Reading" progress cards, and highly maintainable styles.
- **🗺️ Server-Side Rendering (SSR):** Leveraging **TanStack Start** and **Vite**, the application is fully SSR-capable, ensuring rapid Time-to-First-Byte (TTFB) and perfect SEO indexing out of the box.
- **🧠 Rich Visualizations:** Complex engine mechanics (like Prototype Chains, Execution Contexts, and Lexical Scope) are visualized through custom ASCII-style architecture diagrams for mental model clarity.
- **⚔️ Interactive Challenges & FAANG Q&A:** Dynamic components render side-by-side "Wrong vs. Right" architectural comparisons and difficulty-graded interview questions.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Framework:** React 19 (Hooks, Concurrent Rendering)
- **Routing & SSR:** TanStack Start & TanStack Router
- **Build Tool:** Vite v7
- **Styling:** Vanilla CSS (CSS Modules, CSS Variables)
- **State Management:** Custom React Contexts integrating with `localStorage` for persistent reading progress.
- **Deployment:** Cloudflare / Vercel ready (Nitro engine)

### Data-Driven UI
The entire handbook is driven by a centralized, strongly-typed data schema (`src/handbook/data/topics.js`). This architecture allows for massive horizontal scaling of content without having to write duplicate React components. Specialized components (`<Code />`, `<Challenge />`, `<InterviewPrep />`) ingest the schema and dynamically render the curriculum.

---

## 📚 Curriculum Covered (Current Snapshot)

With an expanding repository of **38 core topics**, the handbook covers:

1. **V8 Engine Internals:** Call Stack, Memory Heap, Garbage Collection, Inline Caching, and Hidden Classes.
2. **Concurrency & Scaling:** Event Loop, Macrotasks vs Microtasks, Web Workers, and Atomics.
3. **Execution Context & Scope:** `var`/`let`/`const`, Hoisting, TDZ, and Closures.
4. **Data Structures & Algorithms:** Stack vs Heap, Value vs Reference, Immutability, Tries, Heaps, and Amortized Complexity.
5. **Advanced Objects:** `this` binding (Implicit/Explicit/New/Default), Prototype Chains.
6. **Async Programming:** Promises, `async/await`, Error Handling, and unhandled rejections.
7. **TypeScript Integration:** Generics, Conditional Types, `infer`, and Structural vs. Nominal Typing.
8. **Browser Mechanics:** DOM Repaints vs Reflows, MutationObservers, Regex NFA engines.

---

## 🚀 Quick Start (Local Development)

Want to run the handbook locally and explore the source code?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/js-handbook.git
   cd js-handbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for Production (SSR):**
   ```bash
   npm run build
   npm run start
   ```

---

## 🤝 Let's Connect

I'm a frontend engineer passionate about web performance, architecture, and JavaScript internals. If you're a recruiter or hiring manager looking for a developer who understands *how* the tools work under the hood (rather than just how to use them), I'd love to chat!

- **LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourusername)
- **Portfolio:** [Your Personal Website](https://yourwebsite.com)
- **Email:** your.email@example.com

---
<p align="center">
  <em>Built with ❤️ and raw JavaScript.</em>
</p>
