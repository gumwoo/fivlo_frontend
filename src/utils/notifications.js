// src/utils/notifications.js

// All functions use dynamic import so the app won't crash if expo-notifications
// isn't installed yet. When installed, features work immediately after restart.

const DAY_MAP = { '일': 1, '월': 2, '화': 3, '수': 4, '목': 5, '금': 6, '토': 7 };

export async function ensureNotificationPermissionsAsync() {
  try {
    const Notifications = (await import('expo-notifications')).default;
    const { getPermissionsAsync, requestPermissionsAsync, setNotificationHandler } = await import('expo-notifications');
    const settings = await getPermissionsAsync();
    if (settings.status !== 'granted') {
      await requestPermissionsAsync();
    }
    setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
    return true;
  } catch (e) {
    // Module missing
    return false;
  }
}

export function parseTime(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return { hour: 9, minute: 0 };
  const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
  return { hour: isNaN(h) ? 9 : h, minute: isNaN(m) ? 0 : m };
}

export async function scheduleReminderNotifications(reminder) {
  try {
    const Notifications = (await import('expo-notifications')).default;
    const { scheduleNotificationAsync } = await import('expo-notifications');
    const ok = await ensureNotificationPermissionsAsync();
    if (!ok) return [];

    const { hour, minute } = parseTime(reminder.time);
    const days = Array.isArray(reminder.repeatDays) ? reminder.repeatDays : [];
    const content = {
      title: 'FIVLO',
      body: '무언가 놓고가신 건 없으신가요?',
      data: {
        type: 'reminder',
        id: reminder.id,
        title: reminder.title,
        checklist: reminder.checklist || [],
      },
    };

    const ids = [];
    if (days.length > 0) {
      for (const d of days) {
        const weekday = DAY_MAP[d];
        if (!weekday) continue;
        const trigger = { hour, minute, repeats: true, weekday };
        const id = await scheduleNotificationAsync({ content, trigger });
        ids.push(id);
      }
    } else {
      const trigger = { hour, minute, repeats: true };
      const id = await scheduleNotificationAsync({ content, trigger });
      ids.push(id);
    }
    return ids;
  } catch (e) {
    return [];
  }
}

export async function cancelReminderNotifications(ids) {
  try {
    const { cancelScheduledNotificationAsync } = await import('expo-notifications');
    if (!Array.isArray(ids)) return;
    for (const id of ids) {
      try { await cancelScheduledNotificationAsync(id); } catch {}
    }
  } catch {}
}

