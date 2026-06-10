import { createFileRoute, notFound } from "@tanstack/react-router";
import { TOPIC_MAP } from "../handbook/data/topics";
import { TopicView } from "../handbook/components/TopicView.jsx";

export const Route = createFileRoute("/handbook/$topicId")({
  loader: ({ params }) => {
    const topic = TOPIC_MAP[params.topicId];
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.topic;
    if (!t) return { meta: [{ title: "Topic — JS Handbook 2.0" }] };
    const title = `${t.title} — JS Handbook 2.0`;
    return {
      meta: [
        { title },
        { name: "description", content: t.subtitle },
        { property: "og:title", content: title },
        { property: "og:description", content: t.subtitle },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useLoaderData();
  return <TopicView topic={topic} />;
}

function NotFound() {
  return (
    <div className="hb-container">
      <h1 style={{ color: "var(--hb-fg)" }}>Topic not found</h1>
      <p style={{ color: "var(--hb-fg-muted)" }}>Pick a topic from the sidebar.</p>
    </div>
  );
}

function ErrorView({ error }: { error: Error }) {
  return (
    <div className="hb-container">
      <h1 style={{ color: "var(--hb-fg)" }}>Something went wrong</h1>
      <p style={{ color: "var(--hb-fg-muted)" }}>{error.message}</p>
    </div>
  );
}
