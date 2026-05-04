import ApiError from "../utils/apiError.js";

export const requireRole = (...allowedRoles) => {
  return (req, _, next) => {
    const role = String(req.user?.role || "").toUpperCase();

    if (!role) {
      return next(
        new ApiError(401, "Authentication required", {
          code: "AUTH_REQUIRED",
        }),
      );
    }

    const normalizedAllowed = allowedRoles.map((r) =>
      String(r || "").toUpperCase(),
    );

    if (!normalizedAllowed.includes(role)) {
      return next(
        new ApiError(403, "Forbidden", {
          code: "FORBIDDEN",
        }),
      );
    }

    return next();
  };
};
