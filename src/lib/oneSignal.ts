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
    addTags: (tags: Record<string, string>) => void | Promise<void>;
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
    __oneSignalInitPromise?: Promise<OneSignalInstance>;
  }
}

const defaultOneSignalAppId = "1a05e3b9-e540-4b4f-b549-710b32b9a17b";

let initPromise: Promise<OneSignalInstance> | null = null;

export const oneSignalAppId =
  (import.meta.env.VITE_ONESIGNAL_APP_ID as string | undefined) ||
  defaultOneSignalAppId;

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

  initPromise =
    window.__oneSignalInitPromise ??
    Promise.reject(new Error("OneSignal SDK was not queued from index.html."));

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
  await OneSignal.User.addTags({
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
