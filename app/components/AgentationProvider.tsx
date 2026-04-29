"use client";

import { EnhancedAgentation } from "@litmers-dev/agentation-kit";

const submitEndpoint =
  process.env.NEXT_PUBLIC_AGENTATION_SUBMIT_ENDPOINT ?? "/api/agentation/submit";

const webhookUrl = process.env.NEXT_PUBLIC_AGENTATION_WEBHOOK_URL;

const projectLabel =
  process.env.NEXT_PUBLIC_AGENTATION_PROJECT_LABEL ?? "funni-prototype";

const agentationEnabled =
  process.env.NEXT_PUBLIC_AGENTATION_ENABLED === "1" ||
  process.env.NEXT_PUBLIC_AGENTATION_ENABLED === "true";

export default function AgentationProvider() {
  if (!agentationEnabled) return null;
  return (
    <EnhancedAgentation
      submitEndpoint={submitEndpoint}
      webhookUrl={webhookUrl}
      extraContext={{ projectLabel }}
    />
  );
}
