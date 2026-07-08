type OneSignalInstance = {
  init: (options: {
    appId: string;
    allowLocalhostAsSecureOrigin?: boolean;
    notificationClickHandlerMatch?: "exact" | "origin";
    notificationClickHandlerAction?: "navigate" | "focus";
    notifyButton?: { enable: boolean };
    welcomeNotification?: { disable: boolean };
  }) => Promise<void>;
  Notifications: {
    isPushSupported: () => boolean;
    permission: boolean;
    requestPermission: () => Promise<boolean | void>;
    setDefaultTitle: (title: string) => void;
    setDefaultUrl: (url: string) => void;
  };
  User: {
    addTags: (tags: Record<string, string>) => void;
    PushSubscription: {
      optedIn: boolean;
      optIn: () => Promise<void>;
    };
  };
};

type OneSignalDeferredCallback = (oneSignal: OneSignalInstance) => void | Promise<void>;

declare global {
  interface Window {
    OneSignalDeferred?: OneSignalDeferredCallback[];
  }
}

const defaultOneSignalAppId = "1a05e3b9-e540-4b4f-b549-710b32b9a17b";

let scriptPromise: Promise<void> | null = null;
let initPromise: Promise<OneSignalInstance> | null = null;

export const oneSignalAppId =
  (import.meta.env.VITE_ONESIGNAL_APP_ID as string | undefined) ||
  defaultOneSignalAppId;

function loadOneSignalScript() {
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="OneSignalSDK.page.js"]')) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load OneSignal SDK."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function isOneSignalConfigured() {
  return Boolean(oneSignalAppId);
}

export async function initOneSignal() {
  if (!oneSignalAppId) {
    throw new Error("Missing OneSignal App ID.");
  }

  if (initPromise) {
    return initPromise;
  }

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  await loadOneSignalScript();

  initPromise = new Promise((resolve, reject) => {
    window.OneSignalDeferred?.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: oneSignalAppId,
          allowLocalhostAsSecureOrigin: true,
          notificationClickHandlerAction: "navigate",
          notificationClickHandlerMatch: "origin",
          notifyButton: { enable: false },
          welcomeNotification: { disable: true },
        });

        OneSignal.Notifications.setDefaultTitle("dqhsddkbm");
        OneSignal.Notifications.setDefaultUrl(`${window.location.origin}/study/notes`);
        resolve(OneSignal);
      } catch (error) {
        reject(error);
      }
    });
  });

  return initPromise;
}

export async function requestVocabularyNotifications() {
  const OneSignal = await initOneSignal();

  if (!OneSignal.Notifications.isPushSupported()) {
    return {
      ok: false,
      message: "This browser does not support web push.",
    };
  }

  await OneSignal.Notifications.requestPermission();
  await OneSignal.User.PushSubscription.optIn();
  OneSignal.User.addTags({
    vocab_notifications: "true",
    vocab_language: "ru",
    vocab_schedule: "07:00,19:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return {
    ok: OneSignal.Notifications.permission || OneSignal.User.PushSubscription.optedIn,
    message:
      OneSignal.Notifications.permission || OneSignal.User.PushSubscription.optedIn
        ? "Vocabulary notifications are enabled."
        : "Notification permission was not granted.",
  };
}
