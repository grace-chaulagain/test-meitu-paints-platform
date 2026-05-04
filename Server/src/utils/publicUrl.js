import { APP_URL, IS_PRODUCTION } from "../config/env.js";

function cleanPath(path = "/") {
  const raw = String(path || "/");
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function getPublicAppBaseUrl() {
  if (!APP_URL && IS_PRODUCTION) {
    throw new Error("APP_URL is required to build public links");
  }

  return (APP_URL || "http://localhost:5173").replace(/\/+$/, "");
}

export function buildPublicAppUrl(path = "/") {
  return `${getPublicAppBaseUrl()}${cleanPath(path)}`;
}
