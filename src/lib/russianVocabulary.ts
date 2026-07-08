export type VocabWord = {
  id: string;
  russian: string;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  category: string;
  sourceUrl: string;
};

export const russianVocabulary: VocabWord[] = [
  {
    id: "privet",
    russian: "привет",
    pronunciation: "privet",
    meaning: "xin chào",
    example: "Привет, как дела?",
    exampleMeaning: "Xin chào, bạn thế nào?",
    category: "Greetings",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "spasibo",
    russian: "спасибо",
    pronunciation: "spasibo",
    meaning: "cảm ơn",
    example: "Спасибо за помощь.",
    exampleMeaning: "Cảm ơn vì sự giúp đỡ.",
    category: "Basics",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "pozhaluysta",
    russian: "пожалуйста",
    pronunciation: "pozhaluysta",
    meaning: "làm ơn / không có gì",
    example: "Пожалуйста, повторите.",
    exampleMeaning: "Làm ơn nhắc lại.",
    category: "Basics",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "utro",
    russian: "утро",
    pronunciation: "utro",
    meaning: "buổi sáng",
    example: "Утро тихое.",
    exampleMeaning: "Buổi sáng yên tĩnh.",
    category: "Time",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "vecher",
    russian: "вечер",
    pronunciation: "vecher",
    meaning: "buổi tối",
    example: "Вечером я учусь.",
    exampleMeaning: "Buổi tối tôi học.",
    category: "Time",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "kniga",
    russian: "книга",
    pronunciation: "kniga",
    meaning: "quyển sách",
    example: "Это хорошая книга.",
    exampleMeaning: "Đây là một quyển sách hay.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "urok",
    russian: "урок",
    pronunciation: "urok",
    meaning: "bài học",
    example: "Урок начинается утром.",
    exampleMeaning: "Bài học bắt đầu vào buổi sáng.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "slovo",
    russian: "слово",
    pronunciation: "slovo",
    meaning: "từ",
    example: "Новое слово легко запомнить.",
    exampleMeaning: "Từ mới này dễ ghi nhớ.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "voda",
    russian: "вода",
    pronunciation: "voda",
    meaning: "nước",
    example: "Я пью воду.",
    exampleMeaning: "Tôi uống nước.",
    category: "Everyday",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "chai",
    russian: "чай",
    pronunciation: "chai",
    meaning: "trà",
    example: "Чай горячий.",
    exampleMeaning: "Trà nóng.",
    category: "Everyday",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "dom",
    russian: "дом",
    pronunciation: "dom",
    meaning: "ngôi nhà",
    example: "Мой дом рядом.",
    exampleMeaning: "Nhà của tôi ở gần đây.",
    category: "Everyday",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "drug",
    russian: "друг",
    pronunciation: "drug",
    meaning: "người bạn",
    example: "Мой друг учит русский.",
    exampleMeaning: "Bạn của tôi học tiếng Nga.",
    category: "People",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "semya",
    russian: "семья",
    pronunciation: "semya",
    meaning: "gia đình",
    example: "Моя семья дома.",
    exampleMeaning: "Gia đình tôi ở nhà.",
    category: "People",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "gorod",
    russian: "город",
    pronunciation: "gorod",
    meaning: "thành phố",
    example: "Город красивый.",
    exampleMeaning: "Thành phố đẹp.",
    category: "Places",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "shkola",
    russian: "школа",
    pronunciation: "shkola",
    meaning: "trường học",
    example: "Школа открыта.",
    exampleMeaning: "Trường học đang mở.",
    category: "Places",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "rabota",
    russian: "работа",
    pronunciation: "rabota",
    meaning: "công việc",
    example: "Работа важная.",
    exampleMeaning: "Công việc quan trọng.",
    category: "Everyday",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "segodnya",
    russian: "сегодня",
    pronunciation: "segodnya",
    meaning: "hôm nay",
    example: "Сегодня я учу пять слов.",
    exampleMeaning: "Hôm nay tôi học năm từ.",
    category: "Time",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "zavtra",
    russian: "завтра",
    pronunciation: "zavtra",
    meaning: "ngày mai",
    example: "Завтра будет новый урок.",
    exampleMeaning: "Ngày mai sẽ có bài học mới.",
    category: "Time",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "khorosho",
    russian: "хорошо",
    pronunciation: "khorosho",
    meaning: "tốt",
    example: "Я хорошо понимаю.",
    exampleMeaning: "Tôi hiểu tốt.",
    category: "Basics",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "medlenno",
    russian: "медленно",
    pronunciation: "medlenno",
    meaning: "chậm",
    example: "Говорите медленно, пожалуйста.",
    exampleMeaning: "Làm ơn nói chậm.",
    category: "Basics",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "ponimayu",
    russian: "понимаю",
    pronunciation: "ponimayu",
    meaning: "tôi hiểu",
    example: "Я понимаю это слово.",
    exampleMeaning: "Tôi hiểu từ này.",
    category: "Phrases",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "uchus",
    russian: "учусь",
    pronunciation: "uchus",
    meaning: "tôi học",
    example: "Я учусь каждый день.",
    exampleMeaning: "Tôi học mỗi ngày.",
    category: "Phrases",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "lyublyu",
    russian: "люблю",
    pronunciation: "lyublyu",
    meaning: "tôi thích / tôi yêu",
    example: "Я люблю русский язык.",
    exampleMeaning: "Tôi thích tiếng Nga.",
    category: "Phrases",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "yazyk",
    russian: "язык",
    pronunciation: "yazyk",
    meaning: "ngôn ngữ",
    example: "Русский язык красивый.",
    exampleMeaning: "Tiếng Nga rất đẹp.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "vremya",
    russian: "время",
    pronunciation: "vremya",
    meaning: "thời gian",
    example: "Время учиться.",
    exampleMeaning: "Đến lúc học rồi.",
    category: "Time",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "tsel",
    russian: "цель",
    pronunciation: "tsel",
    meaning: "mục tiêu",
    example: "Моя цель ясная.",
    exampleMeaning: "Mục tiêu của tôi rõ ràng.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "pamyat",
    russian: "память",
    pronunciation: "pamyat",
    meaning: "trí nhớ",
    example: "Память становится сильнее.",
    exampleMeaning: "Trí nhớ trở nên mạnh hơn.",
    category: "Study",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "spokoyno",
    russian: "спокойно",
    pronunciation: "spokoyno",
    meaning: "bình tĩnh",
    example: "Учись спокойно.",
    exampleMeaning: "Hãy học một cách bình tĩnh.",
    category: "Focus",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "nachalo",
    russian: "начало",
    pronunciation: "nachalo",
    meaning: "sự bắt đầu",
    example: "Это хорошее начало.",
    exampleMeaning: "Đây là một sự bắt đầu tốt.",
    category: "Focus",
    sourceUrl: "https://www.lingohut.com/",
  },
  {
    id: "uspek",
    russian: "успех",
    pronunciation: "uspekh",
    meaning: "thành công",
    example: "Успех приходит тихо.",
    exampleMeaning: "Thành công đến một cách lặng lẽ.",
    category: "Focus",
    sourceUrl: "https://www.lingohut.com/",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

export function getTodayVocabularyDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function hashDateKey(dateKey: string) {
  return dateKey.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getDailyVocabulary(date = new Date()) {
  const dateKey = getTodayVocabularyDateKey(date);
  const startIndex = hashDateKey(dateKey) % russianVocabulary.length;

  return Array.from({ length: 5 }, (_, index) => {
    return russianVocabulary[(startIndex + index * 7) % russianVocabulary.length];
  });
}

export function getVocabularyById(id: string | null) {
  if (!id) {
    return null;
  }

  return russianVocabulary.find((word) => word.id === id) ?? null;
}
