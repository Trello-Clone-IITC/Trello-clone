import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

export interface AuthenticatedRequest<
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
    clerk_id: string;
  };
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  message?: string;
}
