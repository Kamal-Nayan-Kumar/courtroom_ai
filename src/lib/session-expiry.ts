type TimedSession = {
  status?: string;
  started_at?: string | Date | null;
  duration_limit_sec?: number | string | null;
};

export function isSessionExpired(session: TimedSession, now = Date.now()): boolean {
  if (session.status === "ended") return false;
  const startedAt = session.started_at ? new Date(session.started_at).getTime() : Number.NaN;
  const duration = Number(session.duration_limit_sec);
  if (!Number.isFinite(startedAt) || !Number.isFinite(duration) || duration <= 0) return false;
  return now >= startedAt + duration * 1000;
}
