import { createFileRoute, redirect } from "@tanstack/react-router";
import { TOPICS } from "../handbook/data/topics";

export const Route = createFileRoute("/handbook/")({
  beforeLoad: () => {
    throw redirect({ to: "/handbook/$topicId", params: { topicId: TOPICS[0].id } });
  },
});
