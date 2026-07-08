type Env = {
  ONESIGNAL_APP_ID: string;
  ONESIGNAL_REST_API_KEY: string;
  SITE_URL: string;
};

type VocabWord = {
  id: string;
  russian: string;
  meaning: string;
  example: string;
};

const vocabulary: VocabWord[] = [
  { id: "privet", russian: "привет", meaning: "xin chào", example: "Привет, как дела?" },
  { id: "spasibo", russian: "спасибо", meaning: "cảm ơn", example: "Спасибо за помощь." },
  { id: "pozhaluysta", russian: "пожалуйста", meaning: "làm ơn / không có gì", example: "Пожалуйста, повторите." },
  { id: "utro", russian: "утро", meaning: "buổi sáng", example: "Утро тихое." },
  { id: "vecher", russian: "вечер", meaning: "buổi tối", example: "Вечером я учусь." },
  { id: "kniga", russian: "книга", meaning: "quyển sách", example: "Это хорошая книга." },
  { id: "urok", russian: "урок", meaning: "bài học", example: "Урок начинается утром." },
  { id: "slovo", russian: "слово", meaning: "từ", example: "Новое слово легко запомнить." },
  { id: "voda", russian: "вода", meaning: "nước", example: "Я пью воду." },
  { id: "chai", russian: "чай", meaning: "trà", example: "Чай горячий." },
  { id: "dom", russian: "дом", meaning: "ngôi nhà", example: "Мой дом рядом." },
  { id: "drug", russian: "друг", meaning: "người bạn", example: "Мой друг учит русский." },
  { id: "semya", russian: "семья", meaning: "gia đình", example: "Моя семья дома." },
  { id: "gorod", russian: "город", meaning: "thành phố", example: "Город красивый." },
  { id: "shkola", russian: "школа", meaning: "trường học", example: "Школа открыта." },
  { id: "rabota", russian: "работа", meaning: "công việc", example: "Работа важная." },
  { id: "segodnya", russian: "сегодня", meaning: "hôm nay", example: "Сегодня я учу пять слов." },
  { id: "zavtra", russian: "завтра", meaning: "ngày mai", example: "Завтра будет новый урок." },
  { id: "khorosho", russian: "хорошо", meaning: "tốt", example: "Я хорошо понимаю." },
  { id: "medlenno", russian: "медленно", meaning: "chậm", example: "Говорите медленно, пожалуйста." },
  { id: "ponimayu", russian: "понимаю", meaning: "tôi hiểu", example: "Я понимаю это слово." },
  { id: "uchus", russian: "учусь", meaning: "tôi học", example: "Я учусь каждый день." },
  { id: "lyublyu", russian: "люблю", meaning: "tôi thích / tôi yêu", example: "Я люблю русский язык." },
  { id: "yazyk", russian: "язык", meaning: "ngôn ngữ", example: "Русский язык красивый." },
  { id: "vremya", russian: "время", meaning: "thời gian", example: "Время учиться." },
  { id: "tsel", russian: "цель", meaning: "mục tiêu", example: "Моя цель ясная." },
  { id: "pamyat", russian: "память", meaning: "trí nhớ", example: "Память становится сильнее." },
  { id: "spokoyno", russian: "спокойно", meaning: "bình tĩnh", example: "Учись спокойно." },
  { id: "nachalo", russian: "начало", meaning: "sự bắt đầu", example: "Это хорошее начало." },
  { id: "uspek", russian: "успех", meaning: "thành công", example: "Успех приходит тихо." },
];

const pad = (value: number) => String(value).padStart(2, "0");

function getDateKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function hashDateKey(dateKey: string) {
  return dateKey.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getDailyVocabulary(date = new Date()) {
  const dateKey = getDateKey(date);
  const startIndex = hashDateKey(dateKey) % vocabulary.length;

  return Array.from({ length: 5 }, (_, index) => {
    return vocabulary[(startIndex + index * 7) % vocabulary.length];
  });
}

async function sendVocabularyNotification(
  env: Env,
  word: VocabWord,
  dateKey: string,
  slot: "morning" | "evening",
  delayMinutes: number,
) {
  const siteUrl = env.SITE_URL.replace(/\/$/, "");
  const url = `${siteUrl}/study/notes?word=${word.id}&day=${dateKey}`;

  const response = await fetch("https://api.onesignal.com/notifications", {
    body: JSON.stringify({
      app_id: env.ONESIGNAL_APP_ID,
      contents: {
        en: `${word.example} — ${word.meaning}`,
      },
      data: {
        day: dateKey,
        source: "lingohut",
        slot,
        wordId: word.id,
      },
      filters: [
        {
          field: "tag",
          key: "vocab_notifications",
          relation: "=",
          value: "true",
        },
      ],
      headings: {
        en: `${word.russian}`,
      },
      name: `Russian vocab ${dateKey} ${slot} ${word.id}`,
      send_after: new Date(Date.now() + delayMinutes * 60 * 1000).toISOString(),
      target_channel: "push",
      url,
    }),
    headers: {
      Authorization: `Key ${env.ONESIGNAL_REST_API_KEY}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OneSignal failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function sendDailyVocabulary(env: Env, now = new Date()) {
  const dateKey = getDateKey(now);
  const dailyWords = getDailyVocabulary(now);
  const slot = now.getUTCHours() < 6 ? "morning" : "evening";
  const words = slot === "morning" ? dailyWords.slice(0, 3) : dailyWords.slice(3);

  return Promise.all(
    words.map((word, index) => {
      return sendVocabularyNotification(env, word, dateKey, slot, index * 3);
    }),
  );
}

export default {
  async fetch(_request: Request, env: Env) {
    const today = getDailyVocabulary();

    return Response.json({
      morning: today.slice(0, 3),
      evening: today.slice(3),
      siteUrl: env.SITE_URL,
    });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(sendDailyVocabulary(env));
  },
};
