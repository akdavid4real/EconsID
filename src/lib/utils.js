export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function createOk(data, meta = {}) {
  return { ok: true, data, meta };
}

export function createError(message, meta = {}) {
  return { ok: false, error: message, meta };
}
