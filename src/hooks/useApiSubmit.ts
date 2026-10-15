"use client";

import { useCallback, useState } from "react";
import { ApiError, apiRequest } from "@/utils/http-client";

export type SubmitState<R> =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; receipt: R }
  | { status: "error"; message: string; issues: Record<string, string> };

/** POSTs a payload to a named API operation and tracks the result. */
export function useApiSubmit<R>(operation: string) {
  const [state, setState] = useState<SubmitState<R>>({ status: "idle" });

  const submit = useCallback(
    async (body: unknown): Promise<R | null> => {
      setState({ status: "submitting" });
      try {
        const receipt = await apiRequest<R>(operation, { method: "POST", body });
        setState({ status: "success", receipt });
        return receipt;
      } catch (error) {
        const apiError = error instanceof ApiError ? error : null;
        setState({
          status: "error",
          message: apiError?.message ?? "Something went wrong. Please try again.",
          issues: apiError?.issues ?? {},
        });
        return null;
      }
    },
    [operation],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}
