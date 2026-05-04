import { APP_URL, API_URL, CORS_ORIGINS, IS_PRODUCTION } from "./env.js";

const configuredOrigins = Array.from(
  new Set([APP_URL, API_URL, ...CORS_ORIGINS].filter(Boolean)),
);

function isLocalDevOrigin(origin = "") {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function isPrivateLanDevOrigin(origin = "") {
  return /^http:\/\/(?:(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):\d+$/.test(
    origin,
  );
}

export function corsOptions() {
  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        configuredOrigins.includes(origin) ||
        (!IS_PRODUCTION &&
          (isLocalDevOrigin(origin) || isPrivateLanDevOrigin(origin)))
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  };
}
