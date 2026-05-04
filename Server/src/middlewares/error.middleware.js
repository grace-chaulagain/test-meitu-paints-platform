import ApiError from "../utils/apiError.js";
import { IS_PRODUCTION } from "../config/env.js";

export const errorMiddleware = (err, req, res, _) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const publicMessage =
    IS_PRODUCTION && status >= 500 ? "Internal server error" : err.message;

  if (status >= 500) {
    console.error("[error]", {
      method: req.method,
      path: req.originalUrl,
      status,
      message: err.message,
    });
  }

  res.status(status).json({
    ok: false,
    error: publicMessage,
    ...(err instanceof ApiError && err.code ? { code: err.code } : {}),
    ...(err instanceof ApiError && status < 500 && err.details
      ? { details: err.details }
      : {}),
    ...(!IS_PRODUCTION && { stack: err.stack }),
  });
};
