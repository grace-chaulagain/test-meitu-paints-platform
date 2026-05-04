import ApiError from "../utils/apiError.js";

function formatIssue(issue) {
  const path = Array.isArray(issue.path) ? issue.path.join(".") : "";
  return {
    path,
    message: issue.message,
    code: issue.code,
  };
}

function normalizeIssues(error) {
  return (error?.issues || []).map(formatIssue);
}

function validatePart(schema, source, label) {
  return (req, _, next) => {
    const result = schema.safeParse(req[source] || {});

    if (!result.success) {
      return next(
        new ApiError(400, "Invalid request input", {
          code: "VALIDATION_ERROR",
          source: label,
          issues: normalizeIssues(result.error),
        }),
      );
    }

    if (source === "query") {
      Object.defineProperty(req, "query", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: result.data,
      });
    } else {
      req[source] = result.data;
    }

    req.validated = {
      ...(req.validated || {}),
      [source]: result.data,
    };

    return next();
  };
}

export const validateBody = (schema) => validatePart(schema, "body", "body");
export const validateQuery = (schema) => validatePart(schema, "query", "query");
export const validateParams = (schema) =>
  validatePart(schema, "params", "params");
