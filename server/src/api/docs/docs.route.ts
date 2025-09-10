import { Router } from "express";
import { openApiDoc } from "../../openapi.js";

const router = Router();

router.get("/openapi.json", (_req, res) => {
  return res.json(openApiDoc);
});

export default router;
