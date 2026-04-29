import { NextResponse } from "next/server";

type AgentationSubmitPayload = {
  event?: unknown;
  url?: unknown;
  timestamp?: unknown;
  output?: unknown;
  annotations?: unknown;
  page?: unknown;
  screenshot?: unknown;
  viewportScreenshot?: unknown;
  fullPageScreenshot?: unknown;
  extraContext?: unknown;
};

type FeedbackInsertPayload = {
  project_ref: string | null;
  project_label: string | null;
  source: string;
  output: string;
  page: Record<string, unknown>;
  annotations: unknown[];
  screenshot: Record<string, unknown> | null;
  extra_context: Record<string, unknown> | null;
  forwarded: boolean;
  forwarded_at: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY?.trim() ?? "";
const forwardTarget = process.env.AGENTATION_FORWARD_TARGET_URL?.trim() ?? "";
const projectRef = process.env.AGENTATION_PROJECT_REF?.trim() ?? "";
const projectLabel =
  process.env.NEXT_PUBLIC_AGENTATION_PROJECT_LABEL?.trim() ?? "";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeSubmitPayload(body: AgentationSubmitPayload) {
  if (typeof body.output !== "string" || !Array.isArray(body.annotations)) {
    return null;
  }

  const page = isRecord(body.page)
    ? body.page
    : {
        url: typeof body.url === "string" ? body.url : null,
        title: null,
        pathname:
          typeof body.url === "string"
            ? (() => {
                try {
                  return new URL(body.url).pathname;
                } catch {
                  return null;
                }
              })()
            : null,
        submittedAt:
          typeof body.timestamp === "number"
            ? new Date(body.timestamp).toISOString()
            : new Date().toISOString(),
      };

  return {
    output: body.output,
    annotations: body.annotations,
    page,
    screenshot: isRecord(body.screenshot)
      ? body.screenshot
      : isRecord(body.viewportScreenshot)
        ? body.viewportScreenshot
        : isRecord(body.fullPageScreenshot)
          ? body.fullPageScreenshot
          : null,
    extraContext: isRecord(body.extraContext) ? body.extraContext : null,
  };
}

async function insertFeedback(payload: FeedbackInsertPayload) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/agentation_feedback?select=id,created_at`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = (await response.json()) as Array<{
    id: string;
    created_at: string;
  }>;

  return rows[0] ?? null;
}

async function forwardPayload(payload: AgentationSubmitPayload) {
  if (!forwardTarget) {
    return false;
  }

  const response = await fetch(forwardTarget, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      source: "base-repo-agentation",
      projectRef: projectRef || null,
      projectLabel: projectLabel || null,
      receivedAt: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgentationSubmitPayload;
    const normalized = normalizeSubmitPayload(body);

    if (!normalized) {
      return NextResponse.json(
        { error: "INVALID_AGENTATION_PAYLOAD" },
        { status: 400 },
      );
    }

    const forwarded = await forwardPayload(body);
    const forwardedAt = forwarded ? new Date().toISOString() : null;

    const saved = await insertFeedback({
      project_ref: projectRef || null,
      project_label: projectLabel || null,
      source: "base-repo-agentation",
      output: normalized.output,
      page: normalized.page,
      annotations: normalized.annotations,
      screenshot: normalized.screenshot,
      extra_context: normalized.extraContext,
      forwarded,
      forwarded_at: forwardedAt,
    });

    return NextResponse.json({
      ok: true,
      forwarded,
      localOnly: !supabaseUrl || !supabaseServiceKey,
      projectRef: projectRef || null,
      saved,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "AGENTATION_SUBMIT_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
