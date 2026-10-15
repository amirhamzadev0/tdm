import type { NextRequest } from "next/server";
import { getOperations, postOperations } from "@/server/http/operations";
import { isAllowedOrigin } from "@/server/http/origin";
import { fail, ok, toErrorResponse } from "@/server/http/respond";

type RouteContext = { params: Promise<{ operation: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { operation } = await params;
  const handler = Object.hasOwn(getOperations, operation) ? getOperations[operation] : undefined;
  if (!handler) return fail(404, "Unknown operation");

  try {
    const data = await handler({ searchParams: request.nextUrl.searchParams, body: undefined });
    return ok(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { operation } = await params;

  if (!isAllowedOrigin(request)) return fail(403, "Forbidden origin");

  const handler = Object.hasOwn(postOperations, operation) ? postOperations[operation] : undefined;
  if (!handler) return fail(404, "Unknown operation");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Request body must be valid JSON.");
  }

  try {
    const data = await handler({ searchParams: request.nextUrl.searchParams, body });
    return ok(data, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}
