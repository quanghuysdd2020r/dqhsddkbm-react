export type FocusMode = "timed" | "unlimited" | "pomodoro";

export type FocusSession = {
  id: string;
  mode: FocusMode;
  label: string;
  minutes: number;
  startedAt: string;
  endedAt: string;
};

export type FocusStats = {
  focusCount: number;
  streak: number;
  todayMinutes: number;
  totalMinutes: number;
  week: Array<{
    dateKey: string;
    label: string;
    minutes: number;
  }>;
};

const STORAGE_KEY = "dqhsddkbm.focus.sessions";

const pad = (value: number) => String(value).padStart(2, "0");

export function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function readSessionsFromStorage(): FocusSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((session): session is FocusSession => {
      return (
        typeof session?.id === "string" &&
        typeof session?.label === "string" &&
        typeof session?.minutes === "number" &&
        typeof session?.startedAt === "string" &&
        typeof session?.endedAt === "string" &&
        ["timed", "unlimited", "pomodoro"].includes(session?.mode)
      );
    });
  } catch {
    return [];
  }
}

export function getFocusSessions() {
  return readSessionsFromStorage().sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
}

export function saveFocusSession(session: Omit<FocusSession, "id">) {
  if (typeof window === "undefined") {
    return [];
  }

  const sessions = getFocusSessions();
  const nextSession: FocusSession = {
    ...session,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
  const nextSessions = [nextSession, ...sessions];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));
  window.dispatchEvent(new Event("focus-sessions-updated"));

  return nextSessions;
}

export function getFocusStats(sessions = getFocusSessions()): FocusStats {
  const today = new Date();
  const todayKey = getDateKey(today);
  const minutesByDay = new Map<string, number>();

  sessions.forEach((session) => {
    const dateKey = getDateKey(new Date(session.startedAt));
    minutesByDay.set(dateKey, (minutesByDay.get(dateKey) ?? 0) + session.minutes);
  });

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const dateKey = getDateKey(date);

    return {
      dateKey,
      label: date.toLocaleDateString("en", { weekday: "short" }),
      minutes: minutesByDay.get(dateKey) ?? 0,
    };
  });

  let streak = 0;
  let cursor = today;

  while ((minutesByDay.get(getDateKey(cursor)) ?? 0) > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    focusCount: sessions.length,
    streak,
    todayMinutes: minutesByDay.get(todayKey) ?? 0,
    totalMinutes: sessions.reduce((total, session) => total + session.minutes, 0),
    week,
  };
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
