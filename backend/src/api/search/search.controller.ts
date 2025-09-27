import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { SearchResultsDto } from "@ronmordo/contracts";
import { searchService } from "./search.service.js";

const search = async (
  req: Request<{}, {}, {}, { q: string }>,
  res: Response<ApiResponse<SearchResultsDto>>,
  next: NextFunction
) => {
  try {
    const { q } = req.query;

    const searchResultsDto = await searchService.search(q);

    return res.status(200).json({ success: true, data: searchResultsDto });
  } catch (err) {
    return next(err);
  }
};

export const searchController = { search };
