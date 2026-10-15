import "server-only";
import { ZodError } from "zod";
import { ServiceError } from "@/services/errors";

const noStore = { "Cache-Control": "no-store" };

export function ok(data: unknown, status = 200): Response {
  return Response.json({ data }, { status, headers: noStore });
}

export function fail(status: number, message: string, issues?: Record<string, string>): Response {
  return Response.json({ error: { message, issues } }, { status, headers: noStore });
}

function issueMap(error: ZodError): Record<string, string> {
  const issues: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in issues)) issues[key] = issue.message;
  }
  return issues;
}

/** Maps any thrown error to a `{ error }` response with a proper status. */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return fail(400, "Please check the highlighted fields.", issueMap(error));
  }
  if (error instanceof ServiceError) {
    return fail(error.status, error.message);
  }
  console.error("Unhandled API error", error);
  return fail(500, "Something went wrong. Please try again.");
}
