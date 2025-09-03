import type { CreateUserInput } from "@/shared/types/user";

export type SignUpInput = CreateUserInput;

export type Strategies = "oauth_google" | "oauth_microsoft" | "oauth_slack";
