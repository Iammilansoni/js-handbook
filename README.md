<div align="center">
  <h1>🚀 The Advanced JavaScript Handbook</h1>
  <p><strong>The JavaScript handbook I wish I had when I started my engineering journey.</strong></p>

  [![React 19](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
  [![TanStack Start](https://img.shields.io/badge/TanStack_Start-Beta-red.svg?style=for-the-badge&logo=react)](https://tanstack.com/start)
  [![Vite](https://img.shields.io/badge/Vite-v7-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
  [![Vanilla CSS](https://img.shields.io/badge/CSS3-Custom_Design_System-1572B6.svg?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
</div>

---

## 🤔 Why I Built This Handbook

During my JavaScript learning journey, I found that most resources either focused heavily on beginner syntax or provided isolated, disconnected interview questions. 

When preparing for software engineering roles, I struggled to find a single resource that truly connected the dots between:
* JavaScript fundamentals
* Browser internals and rendering pipelines
* V8 engine behavior (Garbage Collection, Hidden Classes)
* Real-world frontend architecture
* FAANG-style interview expectations

So, I decided to document everything I learned while studying JavaScript from scratch.

This handbook is **not** a copy of MDN or just a collection of notes. It is a highly structured, interactive knowledge base containing the mental models, visualizations, mistakes I made while learning, interview insights, and engineering concepts that helped me understand how JavaScript *actually* works under the hood.

The goal was simple: **Build the JavaScript handbook I wish I had when I started.**

---

## 📊 By The Numbers

```text
38+ In-Depth Engineering Topics
200+ Executable Code Examples
100+ FAANG-Level Interview Questions
50+ ASCII Visual Diagrams & Architecture Maps
20,000+ Words of Technical Content
```

---

## 🧠 Example Learning Modules

Rather than just listing features, here is a glimpse into the actual engineering challenges this handbook explores:

* **Event Loop Visualization:** Decoupling Macrotasks vs. Microtasks.
* **Closure Debugging Scenarios:** Identifying stale closures in React hooks.
* **V8 Hidden Class Optimization:** How object shapes dictate compiler speeds.
* **Memory Leak Investigation:** The dangers of detached DOM nodes.
* **Async Interview Challenges:** Execution order puzzles and Promise combinators.
* **Algorithmic Complexity:** Analyzing Big-O within specific JavaScript engine contexts.

---

## 🛠️ Engineering Lessons Learned While Building This

Building this platform taught me more than any tutorial ever could. Here are my biggest takeaways:

### 1. Performance Isn't Free
While implementing syntax highlighting, my first instinct was to pull in `Prism.js` or `Highlight.js`. After profiling the bundle size and execution costs, I decided to build a lightweight, proprietary regex-based AST parser myself. This deep-dive taught me immense lessons about bundle size tradeoffs, rendering costs, and long-term maintainability.

### 2. React Is Not The Hard Part
Writing the React components was straightforward. The truly difficult part was structuring the educational content so it could scale to 38+ topics without duplicating UI components or causing layout bloat. This led me to architect a **schema-driven UI**. The entire curriculum is driven by static, deeply structured JS/TS objects (`topics.js`), allowing the UI to render dynamically based on the data layer.

### 3. JavaScript Internals Matter
Spending weeks breaking down closures, execution contexts, event loops, and memory management improved my debugging abilities infinitely more than simply memorizing framework APIs.

---

## 💻 Technical Architecture

While the content is king, the platform itself was built to demonstrate modern, product-grade frontend architecture:

- **Framework:** React 19 via **TanStack Start** (SSR-enabled routing).
- **Styling:** Custom, bespoke **Vanilla CSS Variables**. Zero utility-class bloat. It features semantic token systems, native glassmorphism, and custom animations.
- **Micro-interactions:** Custom "Resume Reading" tracking driven by `IntersectionObserver` to track reading progress natively.

---

## 🚀 Quick Start (Local Development)

Want to run the handbook locally and explore the source code?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Iammilansoni/js-handbook.git
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

---

## 🤝 About the Author & Let's Connect

I'm **Milan Soni**, a Full Stack Developer & GenAI Engineer passionate about web performance, scalable architecture, and JavaScript internals. 

Beyond this handbook, my engineering background includes:
- 🏆 **SIH 2023 National Winner** (Ministry of Coal) for architecting a production-grade RAG platform.
- 📚 **Scopus-Indexed Author** (PiCET-2026) for research on Hybrid Attention-Based Temporal Modeling.
- 💻 **Multiple Software Engineering Internships** building enterprise LLM testing platforms, scalable MERN stack architectures, and AI agents.

If you're a recruiter or hiring manager looking for a developer who understands *how* the tools work under the hood—and can communicate complex technical concepts clearly—I'd love to chat!

- **Portfolio:** [milansoni.vercel.app](https://milansoni.vercel.app/)
- **LinkedIn:** [Milan Soni](https://linkedin.com/in/iammilansoni)
- **GitHub:** [@Iammilansoni](https://github.com/Iammilansoni)
- **Email:** [milansoni96946@gmail.com](mailto:milansoni96946@gmail.com)

---
<p align="center">
  <em>Built with ❤️, raw JavaScript, and a relentless curiosity to learn.</em>
</p>
