/**
 * This is a safe database query, it allows for go-like error handling, but it also takes care of logging.
 * @param fn A function
 */
export const safeDbQuery = async <T>(
  fn: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false }> => {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    console.error(e);
    return { ok: false };
  }
};
