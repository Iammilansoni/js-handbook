import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Sidebar, MobileNav } from "../handbook/components/Sidebar.jsx";
import "../handbook/styles/handbook.css";

export const Route = createFileRoute("/handbook")({
  component: HandbookLayout,
});

function HandbookLayout() {
  const params = useParams({ strict: false }) as { topicId?: string };
  const activeId = params.topicId;

  return (
    <div className="handbook">
      <MobileNav activeId={activeId} />
      <div className="hb-shell">
        <Sidebar activeId={activeId} />
        <main className="hb-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
