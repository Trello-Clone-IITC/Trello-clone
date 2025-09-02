import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";

export function readClerkError(e: unknown): string {
  if (isClerkAPIResponseError(e)) {
    const first = e.errors?.[0];
    return first?.longMessage ?? first?.message ?? e.message;
  }
  if (e instanceof Error) return e.message;
  return "Sign up failed.";
}
