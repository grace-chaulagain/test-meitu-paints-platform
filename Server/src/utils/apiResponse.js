export function apiResponse(res, statusCode, payload) {
  return res.status(statusCode).json({ ok: true, ...payload });
}
