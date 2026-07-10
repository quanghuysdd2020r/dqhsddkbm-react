type Env = {
  ONESIGNAL_APP_ID: string;
  ONESIGNAL_REST_API_KEY: string;
  SITE_URL?: string;
  USE_VOCAB_TAG_FILTER?: string;
};

type VocabWord = {
  ru: string;
  vi: string;
  read: string;
};

const VOCABS: VocabWord[] = [
  { ru: "мечта", vi: "giấc mơ", read: "miếc-ta" },
  { ru: "город", vi: "thành phố", read: "gó-rợt" },
  { ru: "друг", vi: "người bạn", read: "drúc" },
  { ru: "книга", vi: "quyển sách", read: "kní-ga" },
  { ru: "учитель", vi: "giáo viên", read: "u-chí-chiên" },
];

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(sendVocab(env));
  },

  async fetch(_request: Request, env: Env) {
    try {
      const result = await sendVocab(env);

      return new Response(result, {
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        status: 200,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      return new Response(`Worker lỗi: ${message}`, {
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        status: 500,
      });
    }
  },
};

async function sendVocab(env: Env) {
  const appId = String(env.ONESIGNAL_APP_ID || "").trim();
  const apiKey = String(env.ONESIGNAL_REST_API_KEY || "").trim();
  const siteUrl = String(env.SITE_URL || "https://dqhsddkbm.shop").replace(/\/$/, "");

  if (!appId) {
    throw new Error("Missing ONESIGNAL_APP_ID");
  }

  if (!apiKey) {
    throw new Error("Missing ONESIGNAL_REST_API_KEY");
  }

  const slot = getVietnamSlot();
  const words = getTodayWords().slice(slot === "morning" ? 0 : 3, slot === "morning" ? 3 : 5);
  const useTagFilter = String(env.USE_VOCAB_TAG_FILTER || "").trim() === "true";
  const results = [];

  for (const word of words) {
    results.push(
      await sendOneSignalNotification({ apiKey, appId, siteUrl, useTagFilter, word }),
    );
  }

  const sentWords = words.map((word) => `${word.ru} = ${word.vi} (${word.read})`).join("\n");

  return `Đã gửi ${words.length} notification\nKhung giờ: ${
    slot === "morning" ? "sáng" : "tối"
  }\n${sentWords}\n\nOneSignal IDs:\n${results.map((result) => result.id || "(no id)").join("\n")}`;
}

async function sendOneSignalNotification({
  apiKey,
  appId,
  siteUrl,
  useTagFilter,
  word,
}: {
  apiKey: string;
  appId: string;
  siteUrl: string;
  useTagFilter: boolean;
  word: VocabWord;
}) {
  const target = useTagFilter
    ? {
        filters: [
          {
            field: "tag",
            key: "vocab_notifications",
            relation: "=",
            value: "true",
          },
        ],
      }
    : {
        included_segments: ["Subscribed Users"],
      };

  const response = await fetch("https://api.onesignal.com/notifications?c=push", {
    body: JSON.stringify({
      app_id: appId,
      contents: {
        en: `${word.ru} = ${word.vi} (${word.read})`,
      },
      data: {
        ru: word.ru,
        vi: word.vi,
        read: word.read,
        source: "dqhsddkbm-vocab-worker",
      },
      headings: {
        en: "Từ tiếng Nga hôm nay",
      },
      ...target,
      target_channel: "push",
      web_url: `${siteUrl}/study/notes`,
    }),
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    method: "POST",
  });

  const text = await response.text();
  const result = parseOneSignalResponse(text);

  if (!response.ok || hasOneSignalErrors(result)) {
    throw new Error(`OneSignal trả lỗi: ${text}`);
  }

  return result;
}

function parseOneSignalResponse(text: string) {
  try {
    return JSON.parse(text) as { id?: string; errors?: unknown };
  } catch {
    return { errors: [`Invalid JSON response: ${text}`] };
  }
}

function hasOneSignalErrors(result: { errors?: unknown }) {
  if (!result.errors) {
    return false;
  }

  return Array.isArray(result.errors) ? result.errors.length > 0 : true;
}

function getTodayWords(date = new Date()) {
  const dateKey = getVietnamDateKey(date);
  const start = hash(dateKey) % VOCABS.length;

  return Array.from({ length: 5 }, (_, index) => {
    return VOCABS[(start + index) % VOCABS.length];
  });
}

function getVietnamSlot(date = new Date()) {
  const vietnamHour = getVietnamHour(date);

  return vietnamHour < 12 ? "morning" : "evening";
}

function getVietnamHour(date = new Date()) {
  const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  return vietnamDate.getUTCHours();
}

function getVietnamDateKey(date = new Date()) {
  const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  return vietnamDate.toISOString().slice(0, 10);
}

function hash(text: string) {
  return text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
